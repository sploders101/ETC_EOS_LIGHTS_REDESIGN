# configManager
This plugin creates configuration persistence and stores all configurations in your appData folder as determined by electron.

## /config/get
```typescript
msg.once("/config/get/pluginName", (config: object) => {
    // Do something with config...
    // configManager will get your configuration from its cache and send it here.
});
msg.send("/config/get","pluginName");
```

## /config/set
```typescript
msg.once("/config/set/pluginName", () => {
    // Configuration saved successfully!
});
msg.send("/config/set","pluginName",{
    // Configuration data here.
});
```