<script>
	import Button from '$lib/button.svelte'
    import Input from '$lib/input.svelte'


    let { data } = $props();
    let cart = $state();

    let name = $state();
    let phone = $state();
    let address = $state();
    let city = $state();

    let courier = $state()
    let price = $state()

    const disabelButton = $derived(!name || !phone || !address || !city)
    
   // @ts-ignore
   $effect(async () => {
    try {
    // @ts-ignore
    const res = await fetch(`https://dummyjson.com/carts/${data.cartId}`)
    const json = await res.json();
    cart = json;
    } catch (error) {
        return
    }
   })

</script>
<div class="bg-[#C9C9C9] h-screen w-full flex flex-col items-center">
    {#if cart}
        {#if courier && price}
        <div class="bg-[#FFFFFF] w-[30rem] text-center p-2 rounded-md mt-2">
            <p class="font-bold text-[#00FF00] text-lg">Envío Flapp con {courier}⚡️ - ${price}.</p>
        </div>
        {/if}
        <h3 class="font-bold">Carrito:</h3>

        <div class="flex flex-col space-y-2 p-1">
            {#each cart.products as product}
                <div class="w-[30rem] bg-[#FFFFFF] p-[5px] rounded-md">
                    <div class="flex justify-between">
                        <p>{product.title}</p>
                        <p>Precio: ${product.price}</p>
                    </div>
                    <p>Cantidad: {product.quantity}</p>
                </div>
            {/each}
            
            <div class="flex justify-between">
                <p>Total: ${cart.total}</p>
                <Button onclick={() => {
                    window.location.href = '/'
                }} title='Limpiar carro' />
                    
            </div>  
        </div>

    
        <div class="flex flex-col w-[30rem] space-y-1">
            <Input label='Nombre' name='name' bind:value={name} placeholder='John Doe'/>
            <Input label='Telefono' name='phone' bind:value={phone} placeholder="+569 1234 4321" />
            <Input label='Direccion' name='address' bind:value={address} placeholder='Calle Falsa 123' />
            <Input label='Comuna' name='city' bind:value={city} placeholder='Las Condes'/>
        </div>


        <div class="flex space-x-2 mt-5">
            <Button title='Cotizar despacho' disabled={disabelButton} onclick={async () => {
                    try {
                    const res =await fetch('http://localhost:3000/cart', {
                        method: 'POST',
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "products": cart.products.map((/** @type {{ id: any; price: any; quantity: any; total: number; discountedTotal: number; }} */ item) => ({
                                "productId": item.id,
                                "price": item.price,
                                "quantity": item.quantity,
                                "discount": item.total - item.discountedTotal,
                            })),
                            customer_data: {
                                "name": name,
                                "shipping_streer": address,
                                "commune": city,
                                "phone": phone,
                            },
                        })
                    })

                    const json = await res.json()
                    
                    if (res.status == 400) {
                        alert(json.body)
                    } else {
                        courier = json.courier
                        price = json.price
                    }

                } catch (err) {
                    alert("Hubo un error inesperado, por favor intentalo denuevo más tarde")
                }

                    
            }} />

            <Button title='Volver' onclick={() => {
                window.location.href = `/?cart=${data.cartId}`
            }} />
        </div>
    {:else}
        <p>Cargando...</p>
    {/if}
</div>


