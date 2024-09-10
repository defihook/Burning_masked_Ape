import { MetadataKey } from '@nfteyez/sol-rayz/dist/config/metaplex';
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GlobalPool {
    superAdmin: PublicKey,
}

export interface NftListType {
    mint: string;
    updateAuthority: string;
    data: {
        creators: any[];
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
    };
    key: MetadataKey;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number;
    masterEdition?: string | undefined;
    edition?: string | undefined;
}

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const BURN_PROGRAM_ID = new PublicKey("CvvQNDRLaXgTxgE57zz3XP85ewBSp2Lx7uw184pBfq8r");
export const MAD_TOKEN_MINT = new PublicKey("3BAfTyeyPkykQuC5g1FejbebcphhWTBgEwJ75XXBW6CW");
export const MAD_NFT_MINT = new PublicKey("42eNPNH8PpKz12K1EecsX6JsgWwjc7ro6AG923qi5dCY");
export const MAD_TOKEN_DECIMAL = 1_000_000_000;

export const EPOCH = 120;
export const USER_POOL_SIZE = 48;

export interface GlobalPool {
    // 8 + 32
    superAdmin: PublicKey,          // 32
    totalBurned: anchor.BN          // 8
}


export interface UserPool {
    // 8 + 40
    owner: PublicKey,               // 32
    lastClaimedTime: anchor.BN,     // 8
}