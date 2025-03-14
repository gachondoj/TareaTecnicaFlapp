<script>
    import Button from '$lib/button.svelte'
    import { page } from '$app/stores';
	import { untrack } from 'svelte';

    const url = $page.url;

    const paramId = url.searchParams.get('cart')

    let data = $state()
    let cartId = $state(paramId ?? 0)

    $effect(() => {
        paramId;

        untrack(async () => {
            if (paramId) {
                const res = await fetch(`https://dummyjson.com/carts/${paramId}`)
                const json = await res.json();
                data = json.products;
            }
        })
    })

    const getRandomNumber = () => {
        // MAX = 50; MIN = 1
        cartId = Math.floor(Math.random() * (50 - 1 + 1) + 1)
        return cartId
    }
</script>

<div class="bg-[#C9C9C9] h-screen w-full flex flex-col items-center justify-center">
    <div>
        <Button title='Generar carrito' onclick={async () => {
            try {
                const res = await fetch(`https://dummyjson.com/carts/${getRandomNumber()}`)
                const json = await res.json();
                data = json.products;
            } catch (error) {
                alert("Hubo un error inesperado, por favor intente denuevo más tarde")
            }
        }} />

        <Button title='Finalizar compra' disabled={!data} onclick={() => {
            window.location.href = `/cart/${cartId}`
        }} />
            
    </div>

    <div class="grid grid-cols-3 gap-5 p-5">
        {#each data as item}
            <div class="p-[10px] rounded-md w-[20rem] bg-[#FFFFFF] flex flex-col justify-between">
                <p class="font-bold">Title: {item.title}</p>
                <div class="flex justify-between">
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                </div>
            </div>
        {/each}
    </div>
</div>
