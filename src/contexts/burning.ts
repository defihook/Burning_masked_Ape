export type BurnReward = {
    "version": "0.1.0",
    "name": "burn_reward",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "initializeUserPool",
            "accounts": [
                {
                    "name": "userPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "getReward",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "globalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "superAdmin",
                        "type": "publicKey"
                    },
                    {
                        "name": "totalBurned",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "userPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "lastClaimedTime",
                        "type": "i64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidSuperOwner",
            "msg": "Invalid Super Owner"
        },
        {
            "code": 6001,
            "name": "InvalidGlobalPool",
            "msg": "Invalid Global Pool Address"
        },
        {
            "code": 6002,
            "name": "InvalidUserPool",
            "msg": "Invalid User Pool Owner Address"
        },
        {
            "code": 6003,
            "name": "InvalidLimit",
            "msg": "Invalid Daily Limit Per Wallet"
        },
        {
            "code": 6004,
            "name": "InsufficientRewardVault",
            "msg": "Insufficient Reward Token Balance"
        },
        {
            "code": 6005,
            "name": "InvalidMetadata",
            "msg": "Invalid Metadata Address"
        },
        {
            "code": 6006,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6007,
            "name": "UnkownOrNotAllowedNFTCollection",
            "msg": "Unknown Collection Or The Collection Is Not Allowed"
        }
    ]
};

export const IDL: BurnReward = {
    "version": "0.1.0",
    "name": "burn_reward",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "initializeUserPool",
            "accounts": [
                {
                    "name": "userPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "getReward",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userPool",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "globalAuthority",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "mintMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "rewardVault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userRewardAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "globalBump",
                    "type": "u8"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "globalPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "superAdmin",
                        "type": "publicKey"
                    },
                    {
                        "name": "totalBurned",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "userPool",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "lastClaimedTime",
                        "type": "i64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidSuperOwner",
            "msg": "Invalid Super Owner"
        },
        {
            "code": 6001,
            "name": "InvalidGlobalPool",
            "msg": "Invalid Global Pool Address"
        },
        {
            "code": 6002,
            "name": "InvalidUserPool",
            "msg": "Invalid User Pool Owner Address"
        },
        {
            "code": 6003,
            "name": "InvalidLimit",
            "msg": "Invalid Daily Limit Per Wallet"
        },
        {
            "code": 6004,
            "name": "InsufficientRewardVault",
            "msg": "Insufficient Reward Token Balance"
        },
        {
            "code": 6005,
            "name": "InvalidMetadata",
            "msg": "Invalid Metadata Address"
        },
        {
            "code": 6006,
            "name": "MetadataCreatorParseError",
            "msg": "Can't Parse The NFT's Creators"
        },
        {
            "code": 6007,
            "name": "UnkownOrNotAllowedNFTCollection",
            "msg": "Unknown Collection Or The Collection Is Not Allowed"
        }
    ]
};