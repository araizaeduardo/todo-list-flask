from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tasks
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  text TEXT NOT NULL,
                  due_date DATE NOT NULL,
                  status TEXT NOT NULL,
                  created_date DATE NOT NULL,
                  completed_date DATE)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        c.execute("INSERT INTO tasks (text, due_date, status, created_date) VALUES (?, ?, ?, ?)",
                  (data['text'], data['dueDate'], data['status'], datetime.now().strftime('%Y-%m-%d')))
        conn.commit()
        task_id = c.lastrowid
        conn.close()
        return jsonify({'id': task_id}), 201
    
    else:
        c.execute("SELECT * FROM tasks")
        tasks = c.fetchall()
        conn.close()
        return jsonify([{'id': t[0], 'text': t[1], 'dueDate': t[2], 'status': t[3], 
                         'createdDate': t[4], 'completedDate': t[5]} for t in tasks])

@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def update_task(task_id):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    
    if request.method == 'PUT':
        data = request.json
        if 'status' in data:
            c.execute("UPDATE tasks SET status = ? WHERE id = ?", (data['status'], task_id))
        if 'dueDate' in data:
            c.execute("UPDATE tasks SET due_date = ? WHERE id = ?", (data['dueDate'], task_id))
        if 'completedDate' in data:
            c.execute("UPDATE tasks SET completed_date = ? WHERE id = ?", (data['completedDate'], task_id))
        conn.commit()
        conn.close()
        return '', 204
    
    elif request.method == 'DELETE':
        c.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        conn.close()
        return '', 204

if __name__ == '__main__':
    init_db()
    app.run(debug=True)