<script lang="ts">
    let {title, onclick, disabled = false} = $props()
</script>

<button class="border border-black p-1 rounded-md bg-[#6F8BED] disabled:bg-[#CAD5E5]" {disabled} {onclick}>
    {title}
</button>