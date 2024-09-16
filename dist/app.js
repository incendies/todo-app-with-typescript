"use strict";
class TodoList {
    constructor() {
        this.items = [];
        this.nextId = 1;
        console.log('TodoList constructor called');
        this.itemList = document.getElementById('itemList');
        this.newItemInput = document.getElementById('newItem');
        this.addItemButton = document.getElementById('addItem');
        this.dueDateInput = document.getElementById('dueDate');
        this.priorityInput = document.getElementById('priority');
        this.filterSelect = document.getElementById('filter');
        this.sortSelect = document.getElementById('sort');
        if (!this.itemList || !this.newItemInput || !this.addItemButton || !this.dueDateInput || !this.priorityInput || !this.filterSelect || !this.sortSelect) {
            console.error('One or more elements not found');
            return;
        }
        this.loadFromLocalStorage();
        this.addItemButton.addEventListener('click', () => this.addItem());
        this.newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
        this.filterSelect.addEventListener('change', () => this.renderList());
        this.sortSelect.addEventListener('change', () => this.renderList());
        console.log('Event listeners added');
        this.renderList();
    }
    addItem() {
        console.log('addItem called');
        const newItemText = this.newItemInput.value.trim();
        const dueDate = this.dueDateInput.value;
        const priority = this.priorityInput.value;
        if (newItemText) {
            const newItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false,
                dueDate: dueDate ? dueDate : undefined, // Use undefined if no date is provided
                priority: priority
            };
            this.items.push(newItem);
            this.saveToLocalStorage();
            this.renderList();
            this.newItemInput.value = '';
            this.dueDateInput.value = ''; // Clear date input
            this.priorityInput.value = 'low'; // Clear priority input
        }
    }
    toggleComplete(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveToLocalStorage();
            this.renderList();
        }
    }
    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.renderList();
    }
    renderList() {
        console.log('renderList called');
        if (!this.itemList) {
            console.error('itemList is null');
            return;
        }
        this.itemList.innerHTML = '';
        // Get filter and sort options
        const filter = this.filterSelect.value;
        const sort = this.sortSelect.value;
        // Filter items based on completion status
        let filteredItems = this.items;
        if (filter === 'completed') {
            filteredItems = this.items.filter(item => item.completed);
        }
        else if (filter === 'incomplete') {
            filteredItems = this.items.filter(item => !item.completed);
        }
        // Sort items based on due date or priority
        if (sort === 'dueDate') {
            filteredItems.sort((a, b) => {
                if (!a.dueDate)
                    return 1;
                if (!b.dueDate)
                    return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        }
        else if (sort === 'priority') {
            const priorityMap = { low: 1, medium: 2, high: 3 };
            filteredItems.sort((a, b) => {
                return priorityMap[a.priority] -
                    priorityMap[b.priority];
            });
        }
        // Render the filtered and sorted list
        filteredItems.forEach(item => {
            const li = document.createElement('li');
            const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
            const dueDateLabel = item.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${item.dueDate}</span>` : '';
            const priorityClass = `priority-${item.priority.toLowerCase()}`;
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="${item.completed ? 'completed' : ''} ${priorityClass}">${item.text}</span>
                ${dueDateLabel}
                <span class="priority-label">[${item.priority}]</span>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            `;
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => this.toggleComplete(item.id));
            const deleteButton = li.querySelector('.delete');
            deleteButton.addEventListener('click', () => this.deleteItem(item.id));
            this.itemList.appendChild(li);
        });
    }
    saveToLocalStorage() {
        localStorage.setItem('todoItems', JSON.stringify(this.items));
    }
    loadFromLocalStorage() {
        const savedItems = localStorage.getItem('todoItems');
        if (savedItems) {
            this.items = JSON.parse(savedItems);
            this.nextId = this.items.length ? Math.max(...this.items.map(item => item.id)) + 1 : 1;
        }
    }
}
console.log('TodoList class defined');
new TodoList();
console.log('New TodoList instance created');
