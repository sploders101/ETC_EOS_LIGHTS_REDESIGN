# mixer
This plugin creates a mixer for other plugins (namely anime.js) to use so that different intensities can be blended together to prevent strobing. Plugins should use this to communicate with the board whenever possible.

## /board/mixer
```typescript
msg.send("/board/mixer", command as string, identifier as string, submaster as number, value as number);
```
### command
`command` can be `"enable"`, `"disable"`, `"remove"`, or `"set"`.
### identifier
`identifier` is meant to be an identifier unique to the plugin and subroutine that wants control of the board. Each subroutine wanting access to a submaster must have a unique name. The suggested format is `` `${pluginName}:${subroutineName}` ``
### submaster
`submaster` is a number indicating the submaster to set. This parameter is only applicable when `command=="set"`
### value
`value` is the value to set the submaster to. This parameter is only applicable when `command=="set"`