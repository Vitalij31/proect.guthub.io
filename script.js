document.addEventListener('DOMContentLoaded', () => {
    // Элементы страницы
    const pizzaSelection = document.getElementById('pizzaSelection');
    const orderForm = document.getElementById('orderForm');
    const cartSection = document.getElementById('cartSection');
    const backToMenu = document.getElementById('backToMenu');
    const orderButtons = document.querySelectorAll('.order-button');
    const mainMenu = document.getElementById('mainMenu');
    const cartButton = document.getElementById('cartButton');
    const addToCart = document.querySelector('.add-to-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const confirmOrder = document.getElementById('confirmOrder');
    const faqButton = document.getElementById('faqButton');
    const faqModal = document.getElementById('faqModal');
    const closeModal = faqModal.querySelector('.close');
    const deliveryButton = document.querySelector('.delivery-button');
    const restaurantButton = document.querySelector('.restaurant-button');
    const addressInput = document.getElementById('addressInput');
    let currentCart = [];

    // Функция скрытия всех секций
    function hideAllSections() {
        pizzaSelection.style.display = 'none';
        orderForm.style.display = 'none';
        cartSection.style.display = 'none';
    }

    // Функция проверки валидности имени
    function isValidName(name) {
        return /^[А-Яа-яA-Za-z\s\-]+$/.test(name) && name.split(' ').length > 1;
    }

    // Функция проверки номера телефона (для России)
    function isValidPhone(phone) {
        return /^(\+7|8)\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone);
    }

    // Функция проверки времени
    function isValidTime(time) {
        const currentTime = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const inputTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes);

        return inputTime > currentTime; // Время должно быть в будущем
    }

    // Функция проверки количества
    function isValidQuantity(quantity) {
        return !isNaN(quantity) && quantity > 0;
    }

    // Обработчики выбора пиццы
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pizzaName = button.getAttribute('data-pizza');
            document.getElementById('selectedPizza').textContent = `Вы выбрали: ${pizzaName}`;
            hideAllSections();
            orderForm.style.display = 'flex';
        });
    });

    // Переход в главное меню
    mainMenu.addEventListener('click', () => {
        hideAllSections();
        pizzaSelection.style.display = 'grid';
    });

    backToMenu.addEventListener('click', () => {
        hideAllSections();
        pizzaSelection.style.display = 'grid';
    });

    // Открытие корзины
    cartButton.addEventListener('click', () => {
        hideAllSections();
        cartSection.style.display = 'flex';
        renderCart();
    });

    // Добавление в корзину с проверкой формы
    if (addToCart) {
        addToCart.addEventListener('click', () => {
            const selectedPizzaElement = document.getElementById('selectedPizza');
            const selectedPizza = selectedPizzaElement ? selectedPizzaElement.textContent.replace('Вы выбрали: ', '').trim() : null;
            const nameInput = document.getElementById('nameInput').value.trim();
            const phoneInput = document.getElementById('phoneInput').value.trim();
            const timeInput = document.getElementById('timeInput').value.trim();
            const quantityInput = document.getElementById('quantityInput');
            const quantity = parseInt(quantityInput.value, 10);

            if (!selectedPizza) {
                alert('Пожалуйста, выберите пиццу!');
                return;
            }

            if (!isValidName(nameInput)) {
                alert('Введите корректное имя и фамилию!');
                document.getElementById('nameInput').focus();
                return;
            }

            if (!isValidPhone(phoneInput)) {
                alert('Введите корректный номер телефона для России (+7 или 8)');
                document.getElementById('phoneInput').focus();
                return;
            }

            if (!isValidTime(timeInput)) {
                alert('Введите корректное время!');
                document.getElementById('timeInput').focus();
                return;
            }

            if (!isValidQuantity(quantity)) {
                alert('Введите положительное количество пицц!');
                quantityInput.focus();
                return;
            }

            const isDelivery = deliveryButton.classList.contains('selected');
            if (isDelivery && (!addressInput.value || addressInput.style.display === 'none')) {
                alert('Введите адрес доставки!');
                document.getElementById('addressInput').focus();
                return;
            }

            const existingItem = currentCart.find(item => item.pizza === selectedPizza);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                currentCart.push({ pizza: selectedPizza, quantity });
            }

            alert(`Пицца "${selectedPizza}" добавлена в корзину!`);
            hideAllSections();
            pizzaSelection.style.display = 'grid';
        });
    }

    // Отображение корзины
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (currentCart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Корзина пуста. Добавьте пиццу!</p>';
            return;
        }

        currentCart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.pizza} - ${item.quantity} шт.</span>
                <button class="decrease">-</button>
                <button class="increase">+</button>
                <button class="remove">Удалить</button>
            `;

            const decreaseButton = cartItem.querySelector('.decrease');
            const increaseButton = cartItem.querySelector('.increase');
            const removeButton = cartItem.querySelector('.remove');

            decreaseButton.addEventListener('click', () => updateQuantity(index, -1));
            increaseButton.addEventListener('click', () => updateQuantity(index, 1));
            removeButton.addEventListener('click', () => removeFromCart(index));

            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Обновление количества в корзине
    function updateQuantity(index, delta) {
        currentCart[index].quantity += delta;
        if (currentCart[index].quantity <= 0) {
            currentCart.splice(index, 1);
        }
        renderCart();
    }

    // Удаление из корзины
    function removeFromCart(index) {
        currentCart.splice(index, 1);
        renderCart();
    }

    // Подтверждение заказа
    confirmOrder.addEventListener('click', () => {
        if (currentCart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        alert('Ваш заказ принят! Спасибо!');
        currentCart = [];
        renderCart();
        hideAllSections();
        pizzaSelection.style.display = 'grid';
    });

    // Обработчики FAQ
    faqButton.addEventListener('click', () => {
        faqModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        faqModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === faqModal) {
            faqModal.style.display = 'none';
        }
    });

    // Переключение между "Доставка" и "В ресторане"
    deliveryButton.addEventListener('click', () => {
        deliveryButton.classList.add('selected');
        restaurantButton.classList.remove('selected');
        addressInput.style.display = 'block';
    });

    restaurantButton.addEventListener('click', () => {
        restaurantButton.classList.add('selected');
        deliveryButton.classList.remove('selected');
        addressInput.style.display = 'none';
    });

    // Сохраняем данные формы в Local Storage
function saveFormData() {
    const formData = {
        name: document.getElementById('nameInput').value.trim(),
        phone: document.getElementById('phoneInput').value.trim(),
        address: document.getElementById('addressInput').value.trim(),
        time: document.getElementById('timeInput').value.trim(),
        quantity: document.getElementById('quantityInput').value
    };
    localStorage.setItem('orderFormData', JSON.stringify(formData));
}

// Навешиваем обработчик на все поля формы
['nameInput', 'phoneInput', 'addressInput', 'timeInput', 'quantityInput'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    }
});

function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('orderFormData'));
    if (formData) {
        document.getElementById('nameInput').value = formData.name || '';
        document.getElementById('phoneInput').value = formData.phone || '';
        document.getElementById('addressInput').value = formData.address || '';
        document.getElementById('timeInput').value = formData.time || '';
        document.getElementById('quantityInput').value = formData.quantity || 1;
    }
}

// Загружаем данные при открытии формы
document.getElementById('orderForm').addEventListener('show', loadFormData);

confirmOrder.addEventListener('click', () => {
    if (currentCart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    alert('Ваш заказ принят! Спасибо!');
    currentCart = [];
    localStorage.removeItem('orderFormData'); // Удаляем сохранённые данные
    renderCart();
    hideAllSections();
    pizzaSelection.style.display = 'grid';
});


});
