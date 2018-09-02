<template lang="html">
	<div class="root">
		<div>{{test}}</div>
		<md-field>
			<label>Testing</label>
			<md-input v-model="test"></md-input>
		</md-field>
	</div>
</template>

<script lang="js">

	module.exports = {
		data: function() {
			return {
				test: "Hello World!"
			};
		},
		components: {

		}
	};
</script>

<style lang="scss" scoped>
	.md-field {
		margin-top: 0;
	}
	div.root {
		background-color: orange;
		color: white;
		display: block;
	}
</style>
