document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form').addEventListener('submit', function(e) {
        e.preventDefault()
        const nombre = e.target.elements['nombre'].value
        const apellido = e.target.elements['apellido'].value
        const email = e.target.elements['email'].value

        localStorage.setItem('nombre', nombre)
        localStorage.setItem('apellido', apellido)
        localStorage.setItem('email', email)

        location.href = 'juego.html'
    })
})
