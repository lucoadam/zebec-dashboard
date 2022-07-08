export const scheduledTransactions = {
    meta: {
      page: 1,
      per_page: 4,
      total_items: 8,
    },
    data: [
      // {
      //   _id: {
      //     $oid: "62a5ae5641b7ff97ad34dca9",
      //   },
      //   amount: 0.38,
      //   is_transaction_resumed: false,
      //   min_confirmation_required: 2,
      //   multisig_vault: "4Fzv3xq6NjoRyHBhyBMYGSazHG1c4Y1zyWCEdJ8r9pKK",
      //   owners: [
      //     {
      //       owner_name: "Your Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1655045938500,
      //       },
      //       wallet_address: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //     },
      //     {
      //       owner_name: "My Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1655045999780,
      //       },
      //       wallet_address: "7VBTMgbXbnz3gXjCjADM3dzJYsidSRw453mcXV1CfcRj",
      //     },
      //   ],
      //   pda: "DEjfytfvLjwagPorG7eiVJDEXEXEaA3dcUDKnytSXbBb",
      //   receiver: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //   remaining_amount: 0.0,
      //   safe_id: "626bba9d5650c8856bf2c861",
      //   safe_pda: "DdekCeV3QhNdrkKgLcnhG8GLnVcJeux27WTGjxw5DpvQ",
      //   signed_status: "signed",
      //   timestamp: {
      //     $date: 1655045938500,
      //   },
      //   token: "Au6EdrSDubCUc34awy9c6iQAg5GSos9pPBXyZQtyZewV",
      //   token_name: "NXDF",
      //   transaction_id:
      //     "s6vs1gih1JvJhmj4b7zDHRTw6Rr75xzshkBj95eJh5rzwZe6Ft9MCwS58JFiyRweEe2BZ8rZ9UEepkjUBY48emm",
      //   transaction_type: "withdraw",
      // },
      // {
      //   _id: {
      //     $oid: "629e2a42f98b856c862279c3",
      //   },
      //   amount: 0.02,
      //   is_transaction_resumed: false,
      //   min_confirmation_required: 2,
      //   multisig_vault: "4Fzv3xq6NjoRyHBhyBMYGSazHG1c4Y1zyWCEdJ8r9pKK",
      //   owners: [
      //     {
      //       owner_name: "Your Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1654553374595,
      //       },
      //       wallet_address: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //     },
      //     {
      //       owner_name: "My Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1654553425032,
      //       },
      //       wallet_address: "7VBTMgbXbnz3gXjCjADM3dzJYsidSRw453mcXV1CfcRj",
      //     },
      //   ],
      //   pda: "EzWoZ5tWjrTfs7pDRFS5gP5sb4RcxXbNe86Mj7uAnUMj",
      //   receiver: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //   remaining_amount: 0.0,
      //   safe_id: "626bba9d5650c8856bf2c861",
      //   safe_pda: "DdekCeV3QhNdrkKgLcnhG8GLnVcJeux27WTGjxw5DpvQ",
      //   signed_status: "signed",
      //   timestamp: {
      //     $date: 1654553374595,
      //   },
      //   token: "NFTUkR4u7wKxy9QLaX2TGvd9oZSWoMo4jqSJqdMb7Nk",
      //   token_name: "BLOCK",
      //   transaction_id:
      //     "2pWSnJ3QHFMJu9YQy6UYgZWDXLgUVFDvDkPJ2bHLRL6MvznYKqGf8RaCZoHcc3k6T9cu7hthG7aRgPU6HRBaqh7v",
      //   transaction_type: "withdraw",
      // },
      // {
      //   _id: {
      //     $oid: "626f84f1e375a39dedc06056",
      //   },
      //   amount: 0.999,
      //   is_transaction_resumed: false,
      //   min_confirmation_required: 2,
      //   multisig_vault: "4Fzv3xq6NjoRyHBhyBMYGSazHG1c4Y1zyWCEdJ8r9pKK",
      //   owners: [
      //     {
      //       owner_name: "Your Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1651496397559,
      //       },
      //       wallet_address: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //     },
      //     {
      //       owner_name: "My Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1651496442599,
      //       },
      //       wallet_address: "7VBTMgbXbnz3gXjCjADM3dzJYsidSRw453mcXV1CfcRj",
      //     },
      //   ],
      //   pda: "DcdNgZRAiG8PEUK7qTCcLjWeHWaCrGaopMfegGnG5tKs",
      //   receiver: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //   remaining_amount: 0.0,
      //   safe_id: "626bba9d5650c8856bf2c861",
      //   safe_pda: "DdekCeV3QhNdrkKgLcnhG8GLnVcJeux27WTGjxw5DpvQ",
      //   signed_status: "signed",
      //   timestamp: {
      //     $date: 1651496397560,
      //   },
      //   token: "FMJotGUW16AzexRD3vXJQ94AL71cwrhtFaCTGtK1QHXm",
      //   token_name: "LRA",
      //   transaction_id:
      //     "2BaqfMEXCW5HCpsWoYfkd7FYVULuMZFcJsiAsQY69xdwLLEoEdbKZwmijjm8267veYqEqTdjyFer1h6NVc747F2s",
      //   transaction_type: "withdraw",
      // },
      // {
      //   _id: {
      //     $oid: "626cb3cc077ed49661092f63",
      //   },
      //   amount: 0.06,
      //   is_transaction_resumed: false,
      //   min_confirmation_required: 2,
      //   multisig_vault: "4Fzv3xq6NjoRyHBhyBMYGSazHG1c4Y1zyWCEdJ8r9pKK",
      //   owners: [
      //     {
      //       owner_name: "Your Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1651311784683,
      //       },
      //       wallet_address: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //     },
      //     {
      //       owner_name: "My Account",
      //       signed: true,
      //       timestamp: {
      //         $date: 1651311818191,
      //       },
      //       wallet_address: "7VBTMgbXbnz3gXjCjADM3dzJYsidSRw453mcXV1CfcRj",
      //     },
      //   ],
      //   pda: "DTqv8xTJ5WtHUja4oepsVeJMKgMxdeVeC25gqKFghey5",
      //   receiver: "Am4Wcw9jiVGe4NHKDbBbgXVKK5WGWsP4688GkSnBuELs",
      //   remaining_amount: 0.0,
      //   safe_id: "626bba9d5650c8856bf2c861",
      //   safe_pda: "DdekCeV3QhNdrkKgLcnhG8GLnVcJeux27WTGjxw5DpvQ",
      //   signed_status: "signed",
      //   timestamp: {
      //     $date: 1651311784683,
      //   },
      //   token: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
      //   token_name: "UXD",
      //   transaction_id:
      //     "3aXqJYTUkAZZuB5ZpcNJYLMogVwoogPmZWZgjJxTcdggo9Q1BsGhHtTFjgswLRjX1mKTHCxazigDeGnAdLQ4GkwK",
      //   transaction_type: "withdraw",
      // },
    ],
  };
  