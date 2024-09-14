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
        if (newItemText) {
            const newItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false
            };
            this.items.push(newItem);
            this.saveToLocalStorage();
            this.renderList();
            this.newItemInput.value = '';
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
    startEdit(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.editing = true;
            this.renderList();
        }
    }
    saveEdit(id, newText) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.text = newText;
            item.editing = false;
            this.saveToLocalStorage();
            this.renderList();
        }
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
            if (item.editing) {
                li.innerHTML = `
                    <input type="text" value="${item.text}" class="edit-text">
                    <button class="save">Save</button>
                    <button class="cancel">Cancel</button>
                `;
                const saveButton = li.querySelector('.save');
                saveButton.addEventListener('click', () => {
                    const input = li.querySelector('.edit-text');
                    this.saveEdit(item.id, input.value);
                });
                const cancelButton = li.querySelector('.cancel');
                cancelButton.addEventListener('click', () => {
                    item.editing = false;
                    this.renderList();
                });
            }
            else {
                li.innerHTML = `
                    <input type="checkbox" ${item.completed ? 'checked' : ''}>
                    <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                `;
                const checkbox = li.querySelector('input');
                checkbox.addEventListener('change', () => this.toggleComplete(item.id));
                const editButton = li.querySelector('.edit');
                editButton.addEventListener('click', () => this.startEdit(item.id));
                const deleteButton = li.querySelector('.delete');
                deleteButton.addEventListener('click', () => this.deleteItem(item.id));
            }
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
