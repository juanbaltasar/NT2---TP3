new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
        },
        atacar: function () {
            let daño = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= daño;

            this.registrarEvento({esJugador:true,text:'El jugador hiere al monstruo por ' + daño + ' de vida con un ataque normal'});

            if (this.verificarGanador()) {
                return;
            }

            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            let daño = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= daño;

            this.registrarEvento({esJugador:true,text:'El jugador hiere al monstruo por ' + daño + ' de vida con un ataque especial'});

            if (this.verificarGanador()) {
                return;
            }

            this.ataqueDelMonstruo();
        },

        curar: function () {
            (this.saludJugador > 90 ? this.saludJugador = 100 : this.saludJugador += 10);

            this.registrarEvento({esJugador:true,text:(this.saludJugador === 100 ? 'El jugador se cura y rellena su vida por completo' : 'El jugador se cura por 10 de vida')});

            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift(
                {esJugador : evento.esJugador, text : evento.text}
                );
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
            this.turnos = [];
        },

        ataqueDelMonstruo: function () {
            let daño = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= daño;

            this.registrarEvento({esJugador:false,text:'El monstruo hiere al jugador por ' + daño + ' de vida'});

            if (this.verificarGanador()) {
                return;
            }
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango[1] + 1), rango[0]);
        },
        verificarGanador: function () {
            if(this.saludMonstruo <= 0)
            {
                this.terminarPartida();
                if (confirm("Ganaste, jugar de nuevo?")) {
                    this.empezarPartida();
                }
                return true;
            }
            if(this.saludJugador <= 0)
            {
                this.terminarPartida();
                if (confirm("Perdiste, jugar de nuevo?")) {
                    this.empezarPartida();
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            };
        }
    }
});