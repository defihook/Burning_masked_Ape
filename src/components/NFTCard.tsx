import { Skeleton } from "@mui/material";

export default function NFTCard(props: {
    mint: string,
    onSelected: Function,
    selectedNft: string,
    name: string,
    image: string
}) {
    return (
        <div className={props.selectedNft === props.mint ? "nft-card selected" : "nft-card"} onClick={() => props.onSelected(props.mint)}>
            <div className="card-content">
                {props.image === "" ?
                    <>
                        <Skeleton variant="rectangular" width={117} height={117} />
                        <p className="nft-name"><Skeleton variant="rectangular" width={80} height={17} /></p>
                    </>
                    :
                    <>
                        <div className="media">
                            {/* eslint-disable-next-line */}
                            <img
                                src={props.image}
                                alt=""
                            />
                        </div>
                        <p className="nft-name">Masked A.. #{props.name.split("#")[1]}</p>
                    </>
                }
            </div>
        </div>
    )
}