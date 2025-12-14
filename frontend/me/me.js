// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    const timelineData = [
    {
        id: 1,
        type: 'delivered',
        title: 'Order Delivered',
        description: 'Wireless Noise-Cancelling Headphones',
        date: 'December 10, 2025',
        time: '2:34 PM',
        icon: 'check',
        iconClass: 'icon-delivered',
        orderNumber: '#NG-ORD-8829',
        amount: '₦450,000',
        details: 'Package delivered to Lekki Phase 1 gate'
    },
    {
        id: 2,
        type: 'review',
        title: 'Review Posted',
        description: 'You rated "Running Shoes Pro X" ⭐⭐⭐⭐⭐',
        date: 'December 8, 2025',
        time: '11:20 AM',
        icon: 'star',
        iconClass: 'icon-review',
        details: '"Very comfortable. Perfect for morning jogs."'
    },
    {
        id: 3,
        type: 'shipped',
        title: 'Order Shipped',
        description: 'Smart Watch Series 5',
        date: 'December 7, 2025',
        time: '9:15 AM',
        icon: 'truck',
        iconClass: 'icon-shipped',
        orderNumber: '#NG-ORD-8830',
        amount: '₦620,000',
        tracking: 'LAG-TRK-9384756',
        details: 'Dispatch from Ikeja hub. ETA: 12–14 Dec'
    },
    {
        id: 4,
        type: 'order',
        title: 'Order Placed',
        description: 'Smart Watch Series 5 + Screen Protector',
        date: 'December 5, 2025',
        time: '6:45 PM',
        icon: 'bag',
        iconClass: 'icon-order',
        orderNumber: '#NG-ORD-8830',
        amount: '₦650,000',
        items: 2
    },
    {
        id: 5,
        type: 'delivered',
        title: 'Order Delivered',
        description: 'Running Shoes Pro X',
        date: 'December 3, 2025',
        time: '1:22 PM',
        icon: 'check',
        iconClass: 'icon-delivered',
        orderNumber: '#NG-ORD-8821',
        amount: '₦210,000',
        details: 'Received by: Tunde A.'
    },
    {
        id: 6,
        type: 'reward',
        title: 'Reward Points Earned',
        description: 'You earned 500 points from recent purchases',
        date: 'December 1, 2025',
        time: '12:00 PM',
        icon: 'gift',
        iconClass: 'icon-reward',
        details: 'Total points: 2,450'
    },
    {
        id: 7,
        type: 'payment',
        title: 'Payment Method Added',
        description: 'Debit Card ending in 0921',
        date: 'November 28, 2025',
        time: '3:18 PM',
        icon: 'card',
        iconClass: 'icon-payment',
        details: 'Set as default payment method'
    },
    {
        id: 8,
        type: 'address',
        title: 'Shipping Address Updated',
        description: 'New delivery address added',
        date: 'November 25, 2025',
        time: '10:05 AM',
        icon: 'location',
        iconClass: 'icon-address',
        details: '15 Admiralty Way, Lekki Phase 1, Lagos'
    },
    {
        id: 9,
        type: 'delivered',
        title: 'Order Delivered',
        description: 'Coffee Maker Deluxe + Coffee Beans (2kg)',
        date: 'November 20, 2025',
        time: '4:50 PM',
        icon: 'check',
        iconClass: 'icon-delivered',
        orderNumber: '#NG-ORD-8815',
        amount: '₦285,000',
        details: 'Dropped with estate security'
    }
];

    const icons = {
        check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        truck: '<svg viewBox="0 0 24 24"><path d="M18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-9H17V12h4.46L19.5 9.5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.1.9-2 2-2h14v4h3zM3 6v9h.76c.55-.61 1.35-1 2.24-1 .89 0 1.69.39 2.24 1H15V6H3z"/></svg>',
        bag: '<svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>',
        star: '<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        gift: '<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>',
        card: '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
        location: '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
    };

    let currentFilter = 'all';

    function renderTimeline(filter = 'all') {
        const timeline = document.getElementById('timeline');
        const emptyState = document.getElementById('emptyState');
        
        // Check if elements exist
        if (!timeline || !emptyState) {
            console.error('Timeline elements not found');
            return;
        }
        
        const filteredData = filter === 'all' 
            ? timelineData 
            : timelineData.filter(item => item.type === filter);

        if (filteredData.length === 0) {
            timeline.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        timeline.classList.remove('hidden');
        emptyState.classList.add('hidden');
        timeline.innerHTML = '';

        filteredData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.style.animationDelay = `${index * 0.1}s`;

            let buttonsHTML = '';
            if (item.type === 'shipped' || item.type === 'delivered') {
                buttonsHTML = `
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="alert('View order ${item.orderNumber}')">View Order</button>
                        ${item.type === 'shipped' ? '<button class="btn btn-secondary" onclick="alert(\'Track your package\')">Track Package</button>' : ''}
                        ${item.type === 'delivered' ? '<button class="btn btn-secondary" onclick="alert(\'Write a review\')">Write Review</button>' : ''}
                    </div>
                `;
            }

            let trackingHTML = '';
            if (item.tracking) {
                trackingHTML = `
                    <div class="tracking-info">
                        <span>Tracking:</span>
                        <div class="tracking-code">${item.tracking}</div>
                    </div>
                `;
            }

            timelineItem.innerHTML = `
                <div class="timeline-icon ${item.iconClass}">
                    ${icons[item.icon]}
                </div>
                <div class="timeline-content">
                    <div class="content-header">
                        <div class="content-title">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <div class="content-date">${item.date} at ${item.time}</div>
                        </div>
                        ${item.amount ? `
                            <div class="content-amount">
                                <div class="amount-value">${item.amount}</div>
                                ${item.orderNumber ? `<div class="order-number">${item.orderNumber}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                    ${item.details ? `<div class="content-details">${item.details}</div>` : ''}
                    ${trackingHTML}
                    ${buttonsHTML}
                </div>
            `;

            timeline.appendChild(timelineItem);
        });
    }

    function updateCounts() {
        const countAll = document.getElementById('count-all');
        const countOrder = document.getElementById('count-order');
        const countShipped = document.getElementById('count-shipped');
        const countDelivered = document.getElementById('count-delivered');
        
        // Check if elements exist before updating
        if (countAll) countAll.textContent = timelineData.length;
        if (countOrder) countOrder.textContent = timelineData.filter(i => i.type === 'order').length;
        if (countShipped) countShipped.textContent = timelineData.filter(i => i.type === 'shipped').length;
        if (countDelivered) countDelivered.textContent = timelineData.filter(i => i.type === 'delivered').length;
    }

    // Filter button event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                currentFilter = filter;
                renderTimeline(filter);
            });
        });
    }

    // Initialize
    updateCounts();
    renderTimeline();
    
    console.log('Timeline initialized successfully');
});
