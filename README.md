<p align="center" width="100%">
  <img width="75%" src="https://github.com/ccau1/test-stock-exchange/blob/master/test-walk-through.gif">
</p>

# Test Stock Exchange

This is an example to demonstrate how to use a micro-frontend framework to write comprehensive structure from utils to services to components to pages. This is not meant to be a full-fledge project since many data and business plans are still vague.

This application consists of four widgets:

- Chart
- Positions
- Order Book
- Order Entry Ticket

## Setup

This is based on a micro-frontend framework called bit. Ensure bit is installed and PATH is linked so it can be executed in CLI.

### install bit

[Bit Harmony Quick Guide](https://harmony-docs.bit.dev/getting-started/installing-bit)

### install package dependencies

```javascript
bit install
```

### compile modules

```javascript
bit compile
```

### start server

```javascript
bit start
```

### open dashboard page

```
Navigate to pages/dashboard from side menu
```

## Reason for Libraries/Frameworks

### Micro-Frontend Framework

[Bit](https://harmony-docs.bit.dev/) framework has been around for a while, and has a strong community surrounding it. It emphasizes on modularisation of all parts in the project, bringing developer's focus on separation of concern in each module no matter the size. With each module, it also standardizes: documentation, composition, testing and also adds a relations table as a bonus. This brings ease of understanding for modules between developers and is clear to see how thorough the developer has been with the module.

Storybook has always been great but it:

1. does not create package of each module
2. generate documentation page as user-friendly
3. strictly limits to components

### Data Management

I've chosen to go with the Angular approach of singleton services because:

1. updates are slow using store, causing many re-renders easily
2. works better when each module is separated, meaning a container may not even have a page level to hold the store provider
3. unlike redux, dispatched events does not get caught by all redux listeners. This approach is more of a pubSub method where events only distributes to subscribers. This reduce processing concerns in other unrelated components
4. since it is a pubSub handling, receiver receiving event does not automatically equate to re-rendering components

Of course whenever we stray away from the typical approach, there'll be some downsides like a lack of standardized structuring. The standard will be something the team has to agree on or have base classes services must extend to lock certain structures. I think with the advantage of streamlining data distribution and thus maximizing performance in a resource intensive setup like this, it definitely outweighs a conventional library like Redux.

### Chart

The reason for choosing [lightweight-chart](https://www.tradingview.com/lightweight-charts/) is due to the company behind it. [TradingView](https://www.tradingview.com/chart/) has one of the most comprehensive stock charts available for free. On top of that, it is very easy to implement as to something more low-level like d3.js. Since lightweight-chart already specializes in trading charts, it absolutely fits the current project's needs.

### Form

In this requirement scope, [Formik](https://formik.org/) (or any form library) may be a bit of an overkill. With that said, sometimes it is just good to standardize somethings while you're at it. Always good to also add some client-side validations using [Yup](https://github.com/jquense/yup).

### Persistance

Since this is a small size project, and we're storing small items, we don't need to worry too much on where we store these small things like layout and positions. I've chosen to use [js-cookie](https://github.com/js-cookie/js-cookie) to ease my get/set handling.

### Data Fetching

Caching is very important in here since the returning data is big and there can be many repeated fetches. I choose to use [SWR](https://swr.vercel.app/) for component level fetching and the good old [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) for service level API calls like this.

### Animation

There aren't much in here, but [framer-motion](https://www.framer.com/motion/) is a great react animation library that defines the entry and exit animation as well as other states all using its props. It is clean and readable way to define these animation as to the alternatives such as Reanimated 2

## Limitations

1. since this involves using a third-party ([Alpha Vantage](https://www.alphavantage.co/)) library for quote information, we must be aware we are only allowed: 5 API calls per minute, and 500 API calls a day
2. since third-party ([Alpha Vantage](https://www.alphavantage.co/)) library is very limited, I chose to simulate order book and position's current prices

## Missing Features

1. order form type and price doesn't actually take effect. This is because it requires an order system for matching buyers to sellers and watching trigger targets (ie. stop limits)
2. positions PL & MV are simulated
3. only the ui section has test & documentations, for example purposes
