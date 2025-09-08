package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {

		// Route 1: GET /hello/{name}
		se.Router.GET("/hello/{name}", func(e *core.RequestEvent) error {
			name := e.Request.PathValue("name")
			return e.String(http.StatusOK, "Hello "+name)
		})

		// Route 2: GET /block-number
		se.Router.GET("/block-number", func(e *core.RequestEvent) error {
			payload := map[string]interface{}{
				"id":      0,
				"jsonrpc": "2.0",
				"method":  "eth_blockNumber",
				"params":  []interface{}{},
			}
			data, _ := json.Marshal(payload)
			resp, err := http.Post("https://testnet-rpc.monad.xyz", "application/json", bytes.NewBuffer(data))
			if err != nil {
				return e.String(http.StatusInternalServerError, err.Error())
			}
			defer resp.Body.Close()

			var result map[string]interface{}
			json.NewDecoder(resp.Body).Decode(&result)

			if hexNumber, ok := result["result"].(string); ok {
				// แปลงจาก hex → decimal
				var blockNumber int64
				_, err := fmt.Sscanf(hexNumber, "0x%x", &blockNumber)
				if err != nil {
					return e.String(http.StatusInternalServerError, "decode error")
				}
				return e.JSON(http.StatusOK, map[string]interface{}{
					"blockNumber": blockNumber,
				})
			}

			return e.JSON(http.StatusInternalServerError, result)
		})

		// Route 3: POST /eth-call
		se.Router.POST("/eth-call", func(e *core.RequestEvent) error {
			payload := map[string]interface{}{
				"id":      0,
				"jsonrpc": "2.0",
				"method":  "eth_call",
				"params":  []interface{}{},
			}
			data, _ := json.Marshal(payload)
			resp, err := http.Post("https://testnet-rpc.monad.xyz", "application/json", bytes.NewBuffer(data))
			if err != nil {
				return e.String(http.StatusInternalServerError, err.Error())
			}
			defer resp.Body.Close()
			body, _ := ioutil.ReadAll(resp.Body)
			return e.String(http.StatusOK, string(body))
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		panic(err)
	}
}
