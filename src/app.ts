interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    editing?: boolean;
    priority: string;
}

class TodoList {
    private items: TodoItem[] = [];
    private itemList: HTMLUListElement;
    private newItemInput: HTMLInputElement;
    private addItemButton: HTMLButtonElement;
    private dueDateInput: HTMLInputElement;
    private priorityInput: HTMLSelectElement;
    private filterSelect: HTMLSelectElement;
    private sortSelect: HTMLSelectElement;
    private nextId: number = 1;

    constructor() {
        console.log('TodoList constructor called');
        this.itemList = document.getElementById('itemList') as HTMLUListElement;
        this.newItemInput = document.getElementById('newItem') as HTMLInputElement;
        this.addItemButton = document.getElementById('addItem') as HTMLButtonElement;
        this.dueDateInput = document.getElementById('dueDate') as HTMLInputElement;
        this.priorityInput = document.getElementById('priority') as HTMLSelectElement;
        this.filterSelect = document.getElementById('filter') as HTMLSelectElement;
        this.sortSelect = document.getElementById('sort') as HTMLSelectElement;

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

    private addItem(): void {
        console.log('addItem called');
        const newItemText = this.newItemInput.value.trim();
        const dueDate = this.dueDateInput.value;
        const priority = this.priorityInput.value;

        if (newItemText) {
            const newItem: TodoItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false,
                dueDate: dueDate ? dueDate : undefined,  // Use undefined if no date is provided
                priority: priority
            };
            this.items.push(newItem);
            this.saveToLocalStorage();
            this.renderList();
            this.newItemInput.value = '';
            this.dueDateInput.value = '';  // Clear date input
            this.priorityInput.value = 'low';  // Clear priority input
        }
    }

    private toggleComplete(id: number): void {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveToLocalStorage();
            this.renderList();
        }
    }

    private deleteItem(id: number): void {
        this.items = this.items.filter(item => item.id !== id);
        this.saveToLocalStorage();
        this.renderList();
    }

    private renderList(): void {
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
        } else if (filter === 'incomplete') {
            filteredItems = this.items.filter(item => !item.completed);
        }

        // Sort items based on due date or priority
        if (sort === 'dueDate') {
            filteredItems.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        } else if (sort === 'priority') {
            const priorityMap = { low: 1, medium: 2, high: 3 } as const;
            filteredItems.sort((a, b) => {
                return priorityMap[a.priority as keyof typeof priorityMap] - 
                       priorityMap[b.priority as keyof typeof priorityMap];
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

            const checkbox = li.querySelector('input') as HTMLInputElement;
            checkbox.addEventListener('change', () => this.toggleComplete(item.id));

            const deleteButton = li.querySelector('.delete') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => this.deleteItem(item.id));

            this.itemList.appendChild(li);
        });
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('todoItems', JSON.stringify(this.items));
    }

    private loadFromLocalStorage(): void {
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
