// register "GET /hello/{name}" route (allowed for everyone)
routerAdd("GET", "/hello/{name}", (e) => {
    let name = e.request.pathValue("name")

    return e.json(200, { "message": "Hello " + name })
})

// register "POST /api/myapp/settings" route (allowed only for authenticated users)
routerAdd("POST", "/api/myapp/settings", (e) => {
    // do something ...
    return e.json(200, {"success": true})
}, $apis.requireAuth())