import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

import {
    PublicKey,
    Connection,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from '@solana/web3.js';
import {
    getAssociatedTokenAccount,
    getATokenAccountsNeedCreate,
    getNFTTokenAccount,
    getOwnerOfNFT,
    getMetadata,
    METAPLEX,
    isExistAccount,
    solConnection,
    filterError,
} from './utils';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { IDL } from './burning';
import { BURN_PROGRAM_ID, GlobalPool, GLOBAL_AUTHORITY_SEED, MAD_TOKEN_MINT, UserPool, USER_POOL_SIZE } from './type';
import { successAlert } from '../components/toastGroup';

export const initUserPool = async (
    wallet: WalletContextState
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, BURN_PROGRAM_ID, provider);
    try {
        const tx = await createInitUserPoolTx(userAddress, program);
        const { blockhash } = await solConnection.getRecentBlockhash('finalized');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;
        const txId = await wallet.sendTransaction(tx, solConnection);
        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Created User Pool")
        console.log("Your transaction signature", txId);
    } catch (error) {
        console.log(error);
    }
}

export const burnReward = async (
    wallet: WalletContextState,
    mint: PublicKey,
    startLoading: Function,
    closeLoading: Function,
    updatePage: Function
) => {

    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, BURN_PROGRAM_ID, provider);
    try {
        startLoading();
        let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
            userAddress,
            "user-pool",
            BURN_PROGRAM_ID,
        );

        let poolAccount = await solConnection.getAccountInfo(userPoolKey);
        if (poolAccount === null || poolAccount.data === null) {
            await initUserPool(wallet);
        }

        const tx = await createBurnRewardTx(mint, userAddress, program, solConnection);

        const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
        tx.feePayer = userAddress;
        tx.recentBlockhash = blockhash;

        const txId = await wallet.sendTransaction(tx, solConnection);

        await solConnection.confirmTransaction(txId, "finalized");
        successAlert("Transaction is confirmed!");
        closeLoading();
        updatePage();
    } catch (error) {
        console.log(error);
        closeLoading();
        filterError(error);
    }
}



export const createInitializeTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        BURN_PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>initializing program', globalAuthority.toBase58());

    tx.add(program.instruction.initialize(
        bump, {
        accounts: {
            admin: userAddress,
            globalAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const createInitUserPoolTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        BURN_PROGRAM_ID,
    );
    console.log(USER_POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: "user-pool",
        newAccountPubkey: userPoolKey,
        lamports: await solConnection.getMinimumBalanceForRentExemption(USER_POOL_SIZE),
        space: USER_POOL_SIZE,
        programId: BURN_PROGRAM_ID,
    });

    let tx = new Transaction();
    console.log('==>initializing user PDA', userPoolKey.toBase58());
    tx.add(ix);
    tx.add(program.instruction.initializeUserPool(
        {
            accounts: {
                userPool: userPoolKey,
                owner: userAddress
            },
            instructions: [],
            signers: []
        }
    ));

    return tx;
}

export const createBurnRewardTx = async (
    mint: PublicKey,
    userAddress: PublicKey,
    program: anchor.Program,
    connection: Connection,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        BURN_PROGRAM_ID,
    );

    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        BURN_PROGRAM_ID,
    );

    let userTokenAccount = await getAssociatedTokenAccount(userAddress, mint);
    if (!await isExistAccount(userTokenAccount, connection)) {
        let accountOfNFT = await getNFTTokenAccount(mint, connection);
        if (userTokenAccount.toBase58() != accountOfNFT.toBase58()) {
            let nftOwner = await getOwnerOfNFT(mint, connection);
            if (nftOwner.toBase58() == userAddress.toBase58()) userTokenAccount = accountOfNFT;
            else if (nftOwner.toBase58() !== globalAuthority.toBase58()) {
                throw 'Error: Nft is not owned by user';
            }
        }
    }
    console.log("NFT = ", mint.toBase58(), userTokenAccount.toBase58());

    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        userAddress,
        [MAD_TOKEN_MINT]
    );

    console.log("User MAD Account = ", destinationAccounts[0].toBase58())
    let rewardVault = await getAssociatedTokenAccount(globalAuthority, MAD_TOKEN_MINT);

    const metadata = await getMetadata(mint);

    console.log("Metadata=", metadata.toBase58());

    let tx = new Transaction();

    if (instructions.length > 0) instructions.map((ix) => tx.add(ix));
    console.log('==>burning', mint.toBase58());

    tx.add(program.instruction.getReward(
        bump, {
        accounts: {
            owner: userAddress,
            userPool: userPoolKey,
            globalAuthority,
            userNftTokenAccount: userTokenAccount,
            nftMint: mint,
            mintMetadata: metadata,
            rewardVault,
            userRewardAccount: destinationAccounts[0],
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const getUserPoolInfo = async (
    wallet: WalletContextState,
) => {
    if (!wallet.publicKey) return;
    let userAddress: PublicKey = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, BURN_PROGRAM_ID, provider);

    const userInfo: UserPool | null = await getUserPoolState(userAddress, program);
    if (userInfo)
        return {
            owner: userInfo.owner.toBase58(),
            lastClaimedTime: userInfo.lastClaimedTime.toNumber(),
        };
}

export const getGlobalInfo = async () => {
    const globalPool: GlobalPool | null = await getGlobalState();
    if (globalPool) {
        const result = {
            admin: globalPool.superAdmin.toBase58(),
            totalBurned: globalPool.totalBurned.toNumber()
        };
        return result;
    }
}

export const getGlobalState = async (
): Promise<GlobalPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, BURN_PROGRAM_ID, provider);
    const [globalAuthority, _] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        BURN_PROGRAM_ID
    );
    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as unknown as GlobalPool;
    } catch {
        return null;
    }
}

export const getUserPoolState = async (
    userAddress: PublicKey,
    program: anchor.Program,
): Promise<UserPool | null> => {
    let userPoolKey = await anchor.web3.PublicKey.createWithSeed(
        userAddress,
        "user-pool",
        BURN_PROGRAM_ID,
    );
    try {
        let userPoolState = await program.account.userPool.fetch(userPoolKey);
        return userPoolState as unknown as UserPool;
    } catch {
        return null;
    }
}