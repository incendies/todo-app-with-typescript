"use strict";
class TodoList {
    constructor() {
        this.items = [];
        this.nextId = 1;
        console.log('TodoList constructor called');
        this.itemList = document.getElementById('itemList');
        this.newItemInput = document.getElementById('newItem');
        this.addItemButton = document.getElementById('addItem');
        if (!this.itemList || !this.newItemInput || !this.addItemButton) {
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
        console.log('Event listeners added');
        this.renderList();
    }
    addItem() {
        console.log('addItem called');
        const newItemText = this.newItemInput.value.trim();
        const dueDateInput = document.getElementById('dueDate').value;
        const priorityInput = document.getElementById('priority').value;
        if (newItemText) {
            const newItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false,
                dueDate: dueDateInput ? dueDateInput : undefined, // Use undefined if no date is provided
                priority: priorityInput
            };
            this.items.push(newItem);
            this.saveToLocalStorage();
            this.renderList();
            this.newItemInput.value = '';
            document.getElementById('dueDate').value = ''; // Clear date input
            document.getElementById('priority').value = 'low'; // Clear priority input
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
        this.items.forEach(item => {
            const li = document.createElement('li');
            const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
            const dueDateLabel = item.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${item.dueDate}</span>` : '';
            const priorityClass = `priority-${item.priority.toLowerCase()}`; // Set priority-based class
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="${item.completed ? 'completed' : ''} ${priorityClass}">${item.text}</span>
                ${dueDateLabel}
                <span class="priority-label">[${item.priority}]</span>  <!-- Display priority -->
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
