

## ****OPEN HXRO: Vite****

This project build a [Vite](https://vitejs.dev/) UI market V2 that allows users to programmatically connect to the market, view Account Information and start trading to open or cancel all the Limit Orders of TRG account using the **[Hxro’s Dexterity Protocol](https://docs.hxro.network/market-protocols/derivatives-protocol/dexterity)** and the **[Solana web3.js Lib](https://github.com/solana-labs/dexterity)**

  

## Get Started

  

First, install packages all project:

  

```bash
npm i
```

*or*

```bash
yarn
```

Second, run the development server:

```bash
npm run  dev
```

*or*

```bash
yarn dev
```

  

## Requirement

  

  

- Local Environment must have:

  

- Node JS > 16

  

- Knowledge must have about the Dexterity Protocol

  

- Vite, React, Material UI, Styled Component

  

## Document Reference

  

- [React](https://reactjs.org/docs/getting-started.html)

  

- [Vite](https://vitejs.dev/)

  

- [Material UI](https://mui.com/material-ui/getting-started/installation/)

  

- [Styled Component](https://styled-components.com/docs)

  

- [React Hooks](https://react.dev/reference/react/useContext)

  

  
  

## Production Url

https://openhxro.com/


## ### Some technical bits

  

Find much more in-depth technical description in the dexterity [whitepaper](https://hxronetwork.mypinata.cloud/ipfs/QmQTfVoV13wRk2tQqhjTHVNXEZZRtEoH1HLVV64S1g51UZ), for the purposes of connecting it's important to understand two fundamental concepts in dexterity, that of the market product group and trader risk group.

- The market product group (MPG) represents a selection of actively traded products where cross-margining can take place.

- Products are dynamic in the sense that some products in a group will expire and new ones will get created, obviously some like a perpetual future can exist in perpetuity. The MPG is generally created and maintained by the network.

- The trader risk group (TRG) represents the trader's deposits, orders, positions and overall risk in the instruments of a specific MPG. This should be created by the trader as it will be linked to the trader's wallet.
