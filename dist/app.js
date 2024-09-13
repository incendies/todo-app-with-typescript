"use strict";
class TodoList {
    constructor() {
        this.items = [];
        this.nextId = 1;
        this.itemList = document.getElementById('itemList');
        this.newItemInput = document.getElementById('newItem');
        this.addItemButton = document.getElementById('addItem');
        this.addItemButton.addEventListener('click', () => this.addItem());
        this.newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
    }
    addItem() {
        const newItemText = this.newItemInput.value.trim();
        if (newItemText) {
            const newItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false
            };
            this.items.push(newItem);
            this.renderList();
            this.newItemInput.value = '';
        }
    }
    toggleComplete(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.renderList();
        }
    }
    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.renderList();
    }
    renderList() {
        this.itemList.innerHTML = '';
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
                <button class="delete">Delete</button>
            `;
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => this.toggleComplete(item.id));
            const deleteButton = li.querySelector('.delete');
            deleteButton.addEventListener('click', () => this.deleteItem(item.id));
            this.itemList.appendChild(li);
        });
    }
}
new TodoList();
