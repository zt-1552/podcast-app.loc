export class Question {
    static create(question) {
        return fetch('https://js-app-a638a-default-rtdb.europe-west1.firebasedatabase.app/question.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">У вас нету токена</p>')
        }
        return fetch(`https://js-app-a638a-default-rtdb.europe-west1.firebasedatabase.app/question.json`)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                // console.log(response)
                // return response

                const res = response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []

                // console.log(res)

                return res
            })
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage()

        const html = questions.length
        ? questions.map(toCard).join('')
        : `<div class="mui--text-headline">Вопросов пока нету у Вас</div>`

        const list = document.getElementById('list')

        list.innerHTML = html
    }

    static listToHTML(questions) {
        return questions.length
          ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
          : '<p>Вопросов пока нет</p>'
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage()
    all.push(question)
    // console.log(all)
    // console.log(JSON.stringify(all))
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `<div class="mui--text-black-54">
    ${ new Date(question.date).toLocaleDateString() }
    ${ new Date(question.date).toLocaleTimeString() }
    </div>
    <div>${question.text}</div>
    <br>`
}