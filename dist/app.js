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
        // Always start with an empty list
        this.items = [];
        this.nextId = 1;
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
        const text = this.newItemInput.value.trim();
        if (text) {
            const newItem = {
                id: this.nextId++,
                text: text,
                completed: false,
                dueDate: this.dueDateInput.value,
                priority: this.priorityInput.value,
                editing: false
            };
            this.items.push(newItem);
            this.newItemInput.value = '';
            this.dueDateInput.value = '';
            this.priorityInput.value = 'low';
            this.renderList();
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
            this.renderList();
        }
    }
    renderList() {
        // Clear the existing list
        this.itemList.innerHTML = '';
        // Filter and sort items
        let filteredItems = this.filterItems(this.items);
        filteredItems = this.sortItems(filteredItems);
        // Render the filtered and sorted items
        filteredItems.forEach((item) => this.appendItemToList(item));
    }
    appendItemToList(item) {
        const li = document.createElement('li');
        const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
        const dueDateLabel = item.dueDate ? `<span class="ml-2 text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}">Due: ${item.dueDate}</span>` : '';
        const priorityClass = `priority-${item.priority || 'low'}`;
        li.innerHTML = `
            <div class="flex items-center justify-between p-2 border rounded bg-gray-50">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" ${item.completed ? 'checked' : ''} class="form-checkbox h-5 w-5 text-blue-600">
                    <span class="${item.completed ? 'line-through text-gray-500' : ''} ${priorityClass}">${item.text}</span>
                    ${dueDateLabel}
                    <span class="ml-2 font-bold ${priorityClass}">[${item.priority || 'low'}]</span>
                </div>
                <div>
                    <button class="edit px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">${item.editing ? 'Save' : 'Edit'}</button>
                    <button class="delete px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
            </div>
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
    filterItems(items) {
        const filterValue = this.filterSelect.value;
        switch (filterValue) {
            case 'completed':
                return items.filter(item => item.completed);
            case 'incomplete':
                return items.filter(item => !item.completed);
            default:
                return items;
        }
    }
    sortItems(items) {
        const sortValue = this.sortSelect.value;
        switch (sortValue) {
            case 'dueDate':
                return items.sort((a, b) => {
                    if (!a.dueDate)
                        return 1;
                    if (!b.dueDate)
                        return -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                });
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            default:
                return items;
        }
    }
}
// Initialize the TodoList when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    new TodoList();
});
