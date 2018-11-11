# oscPort
This plugin adds OSC communication.

## /oscPort/out
```typescript
interface oscDest {
    remotePort: number;
    remoteAddress: string;
}
interface oscMsg {
    address: string;
    args?: any;
}

msg.send("/oscPort/out",destination as oscDest, msg as oscMsg);
```

## /oscPort/in
This method is a bit heavier, as it is called every time an OSC message is received, even if you do not need it, but allows for wildcards
```typescript
msg.on("/oscPort/in", (address: string, args?: any) => {
    // Do something
});
```

## /oscPort/in/${oscAddress}
This method is more lightweight as your function does not get called unless the message was intended for it
```typescript
msg.on(`/oscPort/in/${oscAddress}`, (args?: any) => {
    // Do something
});
```