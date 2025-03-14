<script lang="ts">
    let {title, onclick, disabled = false} = $props()
</script>

<button class="border border-black p-1 rounded-md bg-[#2000FA] disabled:bg-[#CAD5E5] text-white disabled:text-[#B5B5B5] font-bold" {disabled} {onclick}>
    {title}
</button>