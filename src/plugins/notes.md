# Initialization
```typescript
import { Messager } from '../loader';

export default function init(msg:Messager) {
    // Plugin code...
    // msg extends EventEmitter; adds msg.send(channel:string,...args:any) which also communicates with the renderer process
}
```

# Core Messages

## /ui/addRoute
```typescript
// @@@ FROM interfaces.ts
export interface UIEntry {
    icon?: string;          // Material design icon name
    link?: string;          // Link name. Must be unique
    name: string;           // Name of navbar entry
    componentPath: string;  // Path to vue component
}
// @@@ END

msg.on("/ui/mounted",() => {
    msg.send("/ui/addRoute",{
        ...
    } as UIEntry);
});
```

## /home/add
```typescript
msg.on("/home/mounted",() => {
    msg.send("/home/add","/path/to/component");
});
```

## /settings/add
```typescript
msg.on("/settings/mounted",() => {
    msg.send("/settings/add","/path/to/component");
});
```

# Plugin Messages
Plugins should have documentation on their APIs in a file titled ```notes.md```, documented in a similar fasion to this one.