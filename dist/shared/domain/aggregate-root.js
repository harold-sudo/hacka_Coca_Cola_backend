export class AggregateRoot {
    _domainEvents = [];
    addEvent(event) {
        this._domainEvents.push(event);
    }
    pullEvents() {
        const events = [...this._domainEvents];
        this._domainEvents = [];
        return events;
    }
}
//# sourceMappingURL=aggregate-root.js.map