# Messages

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

ipcMain.on("/ui/mounted",(event:any) => {
    event.sender.send("/ui/addRoute",{
        ...
    } as UIEntry);
});
```

## /home/add
```typescript
ipcMain.on("/home/mounted",(event:any) => {
    event.sender.send("/home/add","/path/to/component.vue");
});
```

## /settings/add
```typescript
ipcMain.on("/settings/mounted",(event:any) => {
    event.sender.send("/settings/add","/path/to/component.vue");
});
```
