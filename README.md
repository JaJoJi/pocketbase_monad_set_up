# Monad PocketBase Base Setup

This repository provides a **base setup** for using **PocketBase** to interact with **Monad smart contracts**.  
It is designed to serve as a starting point for building APIs that can call Monad blockchain endpoints and handle both user authentication and smart contract interactions.

---

## Features

- **User Management**
  - Create, authenticate, and manage users via PocketBase collections.
- **Monad Blockchain Interaction**
  - Call Monad smart contract read endpoints (no gas required)
  - Example: get the latest block number.
- **Custom API Routes**
  - Support for both JS (QuickJS) and Go routes in PocketBase.
  - Allows extending functionality as needed (signing transactions, sending gas, etc.)

---

## Available APIs (via Postman Collection)

The following API endpoints are included in the Postman collection:


cd D:\Pupa\my_project
go mod tidy
go run main.go serve
