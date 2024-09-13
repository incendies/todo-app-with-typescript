interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}


class TodoList {
    private items: TodoItem[] = [];
    private itemList: HTMLUListElement;
    private newItemInput: HTMLInputElement;
    private addItemButton: HTMLButtonElement;
    private nextId: number = 1;

    constructor() {
        console.log('TodoList constructor called');
        this.itemList = document.getElementById('itemList') as HTMLUListElement;
        this.newItemInput = document.getElementById('newItem') as HTMLInputElement;
        this.addItemButton = document.getElementById('addItem') as HTMLButtonElement;

        if (!this.itemList || !this.newItemInput || !this.addItemButton) {
            console.error('One or more elements not found');
            return;
        }

        this.addItemButton.addEventListener('click', () => this.addItem());
        this.newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
        console.log('Event listeners added');
    }

    private addItem(): void {
        console.log('addItem called');
        const newItemText = this.newItemInput.value.trim();
        if (newItemText) {
            const newItem: TodoItem = {
                id: this.nextId++,
                text: newItemText,
                completed: false
            };
            this.items.push(newItem);
            this.renderList();
            this.newItemInput.value = '';
        }
    }

    private toggleComplete(id: number): void {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.completed = !item.completed;
            this.renderList();
        }
    }

    private deleteItem(id: number): void {
        this.items = this.items.filter(item => item.id !== id);
        this.renderList();
    }

    private renderList(): void {
        console.log('renderList called');
        if (!this.itemList) {
            console.error('itemList is null');
            return;
        }
        this.itemList.innerHTML = '';
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
                <button class="delete">Delete</button>
            `;
            
            const checkbox = li.querySelector('input') as HTMLInputElement;
            checkbox.addEventListener('change', () => this.toggleComplete(item.id));

            const deleteButton = li.querySelector('.delete') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => this.deleteItem(item.id));

            this.itemList.appendChild(li);
        });
    }
}

console.log('TodoList class defined');
new TodoList();
console.log('New TodoList instance created');