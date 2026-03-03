const handleBuy = async () => {
    if (!selectedStock || !quantity) {
        alert('Por favor selecciona un activo y especifica la cantidad');
        return;
    }

    setIsSubmitting(true);
    setPurchaseSuccess(false);

    try {
        const total = selectedStock.price * parseFloat(quantity);
        const purchaseData = {
            asset_symbol: selectedStock.symbol,
            asset_name: selectedStock.name,
            asset_type: selectedStock.icon === '₿' || selectedStock.icon === '⟠' || selectedStock.icon === '◎' ? 'crypto' : 'stock',
            quantity: parseFloat(quantity),
            price: orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedStock.price,
            order_type: orderType,
            total_amount: total,
            status: 'pending'
        };

        const token = localStorage.getItem('token');
        const response = await fetch('https://api.equaly.co/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(purchaseData)
        });

        if (!response.ok) {
            throw new Error('Error al procesar la compra');
        }

        const data = await response.json();

        setPurchaseSuccess(true);
        alert(
            `✅ Orden de Compra Registrada\n\n` +
            `Activo: ${selectedStock.symbol}\n` +
            `Cantidad: ${quantity}\n` +
            `Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n` +
            `📧 Se ha enviado un correo electrónico con las instrucciones de pago.\n\n` +
            `⚠️ IMPORTANTE:\n` +
            `Tu transacción está PENDIENTE.\n` +
            `Debes realizar la consignación por el valor total dentro de 2 días.\n\n` +
            `Revisa tu correo para obtener los detalles de la cuenta bancaria.`
        );

        setQuantity('');
        setLimitPrice('');
        setSelectedStock(null);

    } catch (error) {
        console.error('Error al realizar la compra:', error);
        alert('❌ Error al procesar la compra. Por favor intenta nuevamente.');
    } finally {
        setIsSubmitting(false);
    }
};
