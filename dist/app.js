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
        console.log('New item text:', newItemText);
        console.log('Due date:', dueDate);
        console.log('Priority:', priority);
        if (newItemText) {
            const newItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false,
                dueDate: dueDate || undefined,
                priority: priority || 'low'
            };
            console.log('New item object:', newItem);
            this.items.push(newItem);
            this.saveToLocalStorage();
            this.renderList(); // Re-render the list to include the new item
            this.newItemInput.value = '';
            this.dueDateInput.value = '';
            this.priorityInput.value = 'low';
            console.log('Item added and list rendered');
        }
        else {
            console.log('No item added: newItemText is empty');
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
    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (item.editing) {
                // Save the updated text
                item.text = this.newItemInput.value.trim();
                item.editing = false;
            }
            else {
                // Enter edit mode
                this.newItemInput.value = item.text;
                this.newItemInput.focus();
                item.editing = true;
            }
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
        // Get filter and sort options
        const filter = this.filterSelect.value;
        const sort = this.sortSelect.value;
        console.log('Filter:', filter);
        console.log('Sort:', sort);
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
                const priorityA = priorityMap[(a.priority || 'low').toLowerCase()] || 0;
                const priorityB = priorityMap[(b.priority || 'low').toLowerCase()] || 0;
                return priorityB - priorityA;
            });
        }
        // Render the filtered and sorted list
        filteredItems.forEach(item => this.appendItemToList(item));
    }
    appendItemToList(item) {
        const li = document.createElement('li');
        const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
        const dueDateLabel = item.dueDate ? `<span class="due-date ${isOverdue ? 'overdue' : ''}">Due: ${item.dueDate}</span>` : '';
        const priorityClass = `priority-${(item.priority || 'low').toLowerCase()}`;
        li.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''}>
            <span class="${item.completed ? 'completed' : ''} ${priorityClass}">${item.text}</span>
            ${dueDateLabel}
            <span class="priority-label">[${item.priority || 'low'}]</span>
            <button class="edit">${item.editing ? 'Save' : 'Edit'}</button>
            <button class="delete">Delete</button>
        `;
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => this.toggleComplete(item.id));
        const deleteButton = li.querySelector('.delete');
        deleteButton.addEventListener('click', () => this.deleteItem(item.id));
        const editButton = li.querySelector('.edit');
        editButton.addEventListener('click', () => this.editItem(item.id));
        // Append the new item to the end of the list
        this.itemList.appendChild(li);
    }
    saveToLocalStorage() {
        localStorage.setItem('todoItems', JSON.stringify(this.items));
    }
    loadFromLocalStorage() {
        const savedItems = localStorage.getItem('todoItems');
        if (savedItems) {
            try {
                this.items = JSON.parse(savedItems).map((item) => (Object.assign(Object.assign({}, item), { priority: item.priority || 'low' // Set default priority if missing
                 })));
                this.nextId = this.items.length ? Math.max(...this.items.map(item => item.id)) + 1 : 1;
            }
            catch (error) {
                console.error('Error parsing saved items:', error);
                this.items = [];
                this.nextId = 1;
            }
        }
    }
}
// Initialize the TodoList when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    new TodoList();
});
