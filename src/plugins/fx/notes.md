# Messages

## /anime/timeline/new
```typescript
msg.send("/anime/timeline/new", {
	name: "test2",
	linkToSubs: true,
	common: {
		targets: {
			sub56: 0,
			sub57: 0,
			sub59: 0,
			sub60: 1
		},
		easing: 'easeInOutQuint',
		duration: 900,
		loop: true
	},
	objects: [
		{
			sub56: 1,
			sub57: 0,
			sub59: 0,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 0,
			sub59: 1,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 1,
			sub59: 0,
			sub60: 0
		},
		{
			sub56: 0,
			sub57: 0,
			sub59: 0,
			sub60: 1
		}
	]
} as timelineDescriptor /* from plugin.ts */);
```

## /anime/timeline/play
```typescript
msg.send("/anime/timeline/play","test2");
```

## /anime/timeline/pause
```typescript
msg.send("/anime/timeline/pause","test2");
```

## /anime/timeline/seek
```typescript
msg.send("/anime/timeline/seek","test2",500/* ms*/);
```

## /anime/timeline/remove
Stops animation and allows it to be garbage collected
```typescript
msg.send("/anime/timeline/remove","test2");
```

## /anime/timeline/stopall
Stops all registered timelines
```typescript
msg.send("/anime/timeline/stopall");
```

## /shutdown
Stops all animations and allows them to be GCd
```typescript
msg.send("/shutdown");
```