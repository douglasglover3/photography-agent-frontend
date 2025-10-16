<script>
	import CameraIcon from '$lib/assets/camera_icon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={CameraIcon} />
	<title>Photography Agent</title>
</svelte:head>

{@render children?.()}
