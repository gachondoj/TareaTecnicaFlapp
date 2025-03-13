<script lang="ts">
    let { name, label, value = $bindable(), placeholder = ''} = $props()
</script>

<div class="flex flex-col">
    <label for={name}>{label}</label>
    <input id={name} {name} bind:value={value} {placeholder} class="rounded-md px-[5px]" />
</div>