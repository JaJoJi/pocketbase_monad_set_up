// File: /pb/pocketbase-scripts/api/readBlockNumber.js

routerAdd("GET", "/api/readBlockNumber", (e) => {
    // Build RPC payload
    const rpcPayload = {
        id: 0,
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: []
    };

    // Send HTTP POST to Monad testnet RPC
    let resp;
    try {
        resp = $http.send({
            url: "https://testnet-rpc.monad.xyz",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(rpcPayload),
            timeout: 30
        });
    } catch (err) {
        return e.json(500, {
            error: "Failed to fetch block number",
            details: err.message
        });
    }

    // Parse RPC response
    const hexBlock = resp.json?.result || "0x0";
    const decimalBlock = parseInt(hexBlock, 16);

    // Return everything for debugging
    return e.json(200, {
        rpcPayload,        // what we sent
        rpcFullResponse: resp, // full HTTP response
        blockNumberHex: hexBlock,
        blockNumberDecimal: decimalBlock
    });
});


routerAdd("GET", "/api/getBalance/{address}", (e) => {
    let address = e.request.pathValue("address")

    let rpcPayload = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
    }

    let res
    try {
        res = $http.send({
            url: "https://testnet-rpc.monad.xyz",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rpcPayload),
            timeout: 30
        })
    } catch (err) {
        return e.json(500, { error: "HTTP request failed", message: err.message })
    }

    let rawHex = res.json?.result
    let balance = rawHex ? parseInt(rawHex, 16) : null

    return e.json(200, {
        address,
        raw: rawHex,
        balanceInWei: balance,
        rpcPayload,
        rpcFullResponse: {
            headers: res.headers,
            statusCode: res.statusCode,
            body: res.body,
            json: res.json
        }
    })
})



