import { Pagination } from "@mui/material";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Header from "../components/Header";
import NFTCard from "../components/NFTCard";
import { CheckCircleIcon } from "../components/svgIcons";
import { burnReward, getGlobalState } from "../contexts/transaction";
import { MAD_NFT_MINT } from "../contexts/type";
import { getNftMetaData, solConnection } from "../contexts/utils";

const Home: NextPage = () => {
    const wallet = useWallet();
    const [selectedNft, setSelectedNft] = useState("");

    const [walletNfts, setWalletNfts] = useState<any>([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isNext, setIsNext] = useState(false); 0
    const [filterList, setFilterList] = useState<any>([])

    const [totalBurned, setTotalBurned] = useState(0);
    const getGlobal = async () => {
        try {
            const data = await getGlobalState();
            if (data)
                setTotalBurned(data?.totalBurned.toNumber())
        } catch (error) {
            console.log(error)
        }
    }
    const getNfts = async () => {
        setSelectedNft("")
        setWalletNfts([]);
        if (!wallet.publicKey) return;
        const nftList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        let nfts: any = [];
        for (let item of nftList) {
            if (item.data.creators && item.data.creators[0].address === MAD_NFT_MINT.toBase58()) {
                nfts.push(item)
            }
        }
        if (nfts.lengh !== 0) {
            let uriPromise = [];
            for (let item of nfts) {
                const uri = getNftMetaData(new PublicKey(item.mint))
                uriPromise.push(uri)
            }
            const fetchedUris = await Promise.all(uriPromise);
            let emptyNfts: any = [];
            await Promise.all(fetchedUris.map(u => fetch(u))).then(responses =>
                Promise.all(responses.map(res => res.json()))
            )
                .catch(error => {
                    console.log(error)
                }).then((list: any) => {
                    for (let i = 0; i < list.length; i++) {
                        if (list[i]?.attributes.length === 0) {
                            emptyNfts.push({
                                ...list[i],
                                mint: nfts[i].mint
                            }
                            )
                        }
                    }
                });
            setWalletNfts(emptyNfts)
            setFilterList(emptyNfts.slice(0, 12))
        }
    }

    const updatePage = () => {
        getGlobal();
        getNfts();
    }

    const handleSelect = (mint: string) => {
        setSelectedNft(mint)
    }

    const onBurn = async () => {
        try {
            await burnReward(wallet, new PublicKey(selectedNft), () => setBtnLoading(true), () => setBtnLoading(false), () => updatePage())
        } catch (error) {
            setBtnLoading(false);
            console.log(error);
        }
    }

    const onPagination = (event: React.ChangeEvent<unknown>, value: number) => {
        let filterData = walletNfts;
        if (filterData.length !== 0) {
            setFilterList(filterData.slice((value - 1) * 12, value * 12))
            console.log(filterData, value)
        }
    }

    useEffect(() => {
        updatePage();
        // eslint-disable-next-line
    }, [wallet.connected, wallet.publicKey])


    return (
        <>
            <Header totalBurned={totalBurned} connected={wallet.connected} />
            <main>
                <div className="container">
                    <div className="hero-banner">
                        {/* eslint-disable-next-line */}
                        <img
                            src="/img/banner-logo.png"
                            alt=""
                        />
                        <h2>masked ape dao</h2>
                        <p>Burn blank attribute Masked Apes for 10,000 $MAD tokens.<br />Max 1 Masked Ape burn per day per wallet. </p>
                    </div>
                    {wallet.publicKey &&
                        < div className="page-container">
                            <div className="steps">
                                <div className="step-item">
                                    <h5>STEP 1</h5>
                                    <p>Select &#39;Blank&#39; Masked Apes
                                        {selectedNft !== "" && isNext &&
                                            <CheckCircleIcon />
                                        }
                                    </p>
                                </div>
                                <div className="step-item">
                                    <h5>STEP 2</h5>
                                    <p>Burn &#39;Blank&#39; Masked Apes</p>
                                </div>
                            </div>
                            <div className="burn-control">
                                {selectedNft !== "" && !isNext &&
                                    <button className="btn-next" onClick={() => setIsNext(true)}>
                                        Next
                                    </button>
                                }
                                {
                                    selectedNft !== "" && isNext &&
                                    <button
                                        className="btn-next btn-main"
                                        disabled={btnLoading}
                                        onClick={() => onBurn()}
                                    >
                                        {btnLoading ?
                                            <ClipLoader size={12} color="#fff" />
                                            :
                                            <>Burn Masked Ape</>
                                        }
                                    </button>
                                }
                            </div>
                            {walletNfts && walletNfts.length > 13 &&
                                <div className="pagination">
                                    <Pagination count={Math.ceil(walletNfts.length / 12)} variant="outlined" shape="rounded" onChange={onPagination} />
                                </div>
                            }
                            <div className="nft-lists">
                                {/* {selectedNft !== "" && isNext ?
                                    <p className="noties">Note: Show selected Masked Ape here from step 1</p>
                                    :
                                    <p className="noties">Note: Only show Blank attribute Masked Apes here from user connected wallet</p>
                                } */}
                                <div className="content">
                                    {filterList && filterList.lengh !== 0 && filterList.map((nft: any, key: number) => (
                                        <NFTCard
                                            key={key}
                                            selectedNft={selectedNft}
                                            mint={nft.mint}
                                            onSelected={handleSelect}
                                            image={nft.image}
                                            name={nft.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            {walletNfts && walletNfts.length > 13 &&
                                <div className="pagination">
                                    <Pagination count={Math.ceil(walletNfts.length / 12)} variant="outlined" shape="rounded" />
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="bottom-pattern">
                    {/* eslint-disable-next-line */}
                    <img
                        src="/img/bottom-ape.png"
                        alt=""
                    />
                </div>
            </main >
        </>
    )
}

export default Home
