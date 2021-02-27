class Products {
    constructor(identificador, nombre, precio, categoria, especificaciones, destacado) {
        this.identificador = identificador;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.especificaciones = especificaciones;
        this.destacado = destacado;
    };
};

class Client {
    constructor(nombre, email, telefono, productosComprados) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.productosComprados = productosComprados;
    };
};

var cero = 0;
let productos = [];
let productosComprados = [];
let totalProductos = [];
var total = 0;

let grid = $('<div class="grid col-md-10"></div>')
let grid_container = $('<div class="grid-container row d-flex"></div>')
let aside = $(`
        <aside class="col-md-2 d-flex flex-column">
        </aside>
    `
);
let carrito = $(`
        <div class="carritoInner noMostrar">
        <p class="precioTotal">Total: 
            <span id="precioTotal">0</span>
        </p>
        <a href="#/FinalizaCompra" class="comprar btn btn-primary hidden">Comprar</a>
        </div>
    `
);
let noProducts = $('<p class="noProducts">Agregá productos a tu Carrito!</p>');

let categoriasCheckbox = $(`
        <hr>
        <div class="categorias">
            <p>Categorias:</p>
            <form onsubmit="return false" class="categoriasCheckbox">
                <div class="d-flex justify-content-between align-items-center">
                    <input name="identificador" value="FIGURAS" id="FIGURAS" type="radio">
                    <label for="FIGURAS">Figuras</label>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <input name="identificador" value="ROPA" id="ROPA" type="radio">
                    <label for="ROPA">Ropa</label>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <input name="identificador" value="ACCESORIO" id="ACCESORIO" type="radio">
                    <label for="ACCESORIO">Accesorio</label>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <input name="identificador" value="POSTER" id="POSTER" type="radio">
                    <label for="POSTER">Poster</label>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <input name="identificador" value="COSPLAY" id="COSPLAY" type="radio">
                    <label for="COSPLAY">Cosplay</label>
                </div>
                <input class="btn btn-primary" type="submit" value="Aplicar">
            </form>
        </div>
    `
);

let cargando = $(
    '<div id="loader" class="lds-dual-ring col-md-10 hidden"></div>'
);

let compraTerminada = $(`
    <div class="d-flex justify-content-between finalizarCompra row">
        <h1 class="col-md-12">Finalizá tu compra</h1>
        <div class="productos_finalizarCompra col-md-4">
            <div class="total">
                <p>Total</p>
            </div>
        </div>
        <div class="datosPersonales_finalizarCompra col-md-7">
            <h3>Datos Personales</h3>
            <form onsubmit="return false" class="finalizarCompraForm">
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input class="form-control"  type="text" id="nombre" value="Nicolas Cuello">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input class="form-control"  type="email" id="email" value="nico_c@email.com">
                </div>
                <div class="form-group d-flex flex-row justify-content-between flex-wrap telefono">
                    <label class="w-100" for="tel" >Telefono</label>
                    <input class="form-control"  type="text" value="3549687521" id="tel">
                </div>
                <div class="form-group cuotas">
                    <label for="cuotas">Cantidad de Cuotas</label>
                    <select class="form-control" name="" id="cuotas">
                        <option value=""></option>
                        <option value=""></option>
                        <option value=""></option>
                        <option value=""></option>
                    </select>
                </div>
                <h3>Datos de la tarjeta de Credito</h3>
                <div class="tarjeta_finalizarCompra">
                    <div class="row justify-content-between">
                        <div class="col-md-12">
                            <img src="img/credit_card.png">
                        </div>
                        <div class="col-md-7 izquierda_tarjeta">
                            <label for="creditCardNumber">Número de tarjeta</label>
                            <input class="numeroDeTarjeta" type="text" name="" id="creditCardNumber" value="1598-02758-6347-7819">
                            <label for="creditCardName">Nombre</label>
                            <input type="text" name="" id="creditCardName" value="NICOLAS CUELLO">
                            <label for="creditCardCVC">cvc</label>
                            <input type="text" name="" id="creditCardCVC" value="111">
                        </div>
                        <div class="col-md-4 derecha_tarjeta">
                            <div class="row">
                                <div class="col-md-7">
                                    <label for="creditCardDesde">Desde</label>
                                    <input type="text" name="" id="creditCardDesde" value="11/11">
                                </div>
                                <div class="col-md-7">
                                    <label for="credictCardHasta">Hasta</label>
                                    <input type="text" name="" id="credictCardHasta" value="11/11">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <input class="btn btn-primary" type="submit" value="Confirmar compra">
                </div>
            </form>
        </div>
    </div>
    `
);


//DOCUMENT READY FUNCTION
$( () => {
    $('section').append(grid_container)
    $('.grid-container').append(aside)
    $('.grid-container').append(cargando)
    $('.grid-container').append(grid);
    $('.carrito').append(carrito)

//Destacados
    $.when( dolarAjaxCall() , productosAjaxCall() ).done( () => {
        for (const iterator of productos_data) {
            productos.push(new Products(iterator.identificador, iterator.nombre, iterator.precio, iterator.categoria, iterator.especificaciones))
            if (iterator.destacado === true) crearEstructura(iterator, $('.grid'));
        };
        $('.grid-container').prepend('<h3 class="col-md-12">Productos destacados</h3>');
    })

//Categoria
    $('aside').append(categoriasCheckbox)
    $('aside').on('submit', 'form.categoriasCheckbox', (e) => { 
        $('.elProduct').remove()

        for (const iterator of e.target) {
            if (iterator.checked === true) {
                let vcSinGuion = iterator.value
                $('.grid-container h3').html('Viendo: ' + vcSinGuion)
                let vc = iterator.value
                for (const producto of productos_data) {
                    let identificadoEnProducto = producto.identificador
                    if (identificadoEnProducto.indexOf(vc) > -1) {
                        crearEstructura(producto, $('.grid'));    
                    };
                };
            };
        };
        
        // Filtro
        $(e.target).slideUp(400, () => {
            let toggleBtn = $('<a class="toggle btn btn-primary">Volver a filtrar</a>')
            $(e.target.parentElement).append(toggleBtn)
            $(toggleBtn).on('click', (event) => {
                $(e.target).slideDown(300)
                $(event.target).remove()
            })
        })
        
    });

//BUSCAR
    $('form.buscador').submit( (e) => { 
        let inputUsuario = e.target[0].value
        let inputMA = inputUsuario.toUpperCase()

        $('.elProduct').remove();
        $('.grid-container h3').remove();
        $('.grid-container').prepend('<h3 class="col-md-12">Resultados para: ' + inputUsuario + '</h3>');
        for (const iterator of productos_data) {
            let productMA = iterator.nombre.toUpperCase()
            if (productMA.indexOf(inputMA) > -1) {
                crearEstructura(iterator, $('.grid'))
            } 
        }
        
    });

//CARRITO
    $('.carritoInner').prepend(noProducts);
    $('.grid-container').on('click', '.elProduct a.agregar', function(e){
        e.stopPropagation();
        $('.carritoInner p.noProducts').remove()
        cero++;
        let contador = $('#contador')
        let precio = e.currentTarget.nextElementSibling.innerHTML
        let nombre = e.currentTarget.parentElement.parentElement.firstElementChild.innerHTML
        let productoDiv = e.currentTarget.parentElement.parentElement
        let productoId = $(productoDiv).attr('class').replaceAll('elProduct fadeIn ', '')
        //NOTIFICACION
        crearNoti(nombre, precio, 'agregado', 'agregado al')
        cerrarNoti()

        $(contador).addClass('mostrar');
        contador.html(cero)

        //LOCAL STORAGE
        for (const iterator of productos_data) {
            if (iterator.nombre === nombre) {
                sessionStorage.setItem('producto_' + cero, JSON.stringify({iterator}))
            }
        }

        let productoImagen = nombre.replaceAll(' ', '_')
        crearProductCarrito(carrito, nombre, precio, productoImagen, productoId)

        $('a.comprar').removeClass('hidden')

        let totalString = $('span#precioTotal')[0].innerHTML
        var total = parseInt(totalString)
        let precioN = parseInt(precio)
        var total = total + precioN
        $('span#precioTotal')[0].textContent = total
    });

//QUITAR DE CARRITO
    $('.carritoInner').on('click', 'a.quitar', (e) => {
        e.stopPropagation()
        let nombre = e.currentTarget.previousElementSibling.firstElementChild.innerHTML
        let precio = e.currentTarget.previousElementSibling.lastElementChild.innerHTML

        sessionStorage.removeItem('producto_' + cero)
        let contador = $('#contador')
        cero--
        contador.html(cero)
        e.target.parentElement.remove()
        //CARRITO VACIO
        if (cero === 0) {
            $(contador).removeClass('mostrar');
            $('.carritoInner').prepend(noProducts)
            $('a.comprar').addClass('hidden');
        }

        crearNoti(nombre, precio, 'removido', 'removido del')
        cerrarNoti()
        let totalString = $('span#precioTotal')[0].innerHTML
        var total = parseInt(totalString)
        let precioN = parseInt(precio)
        $('span#precioTotal')[0].textContent = total - precioN;
    });
    
//MOSTRA O NO CARRITO
    $('.carrito').on('click', 'svg', (e) => { 
        $('.carritoInner').toggleClass('noMostrar');
        $('#carrito').toggleClass('abierto')
        e.stopPropagation();
    });

    $('.carritoInner').click((e) => {e.stopPropagation();})


//COMPRAR
    $('a.comprar').click((e)=> {
        cero = 0
        $('#contador').removeClass('mostrar')
        $('.carrito').hide()
        $('section').html('')
        $('section').removeClass();
        $('section').addClass('container');
        $('.carritoInner').remove()
        $('section').append(compraTerminada)
        let productosEnCarrito = e.target.parentNode.children;
        for (const iterator of productosEnCarrito) {
            cero++
            if ($(iterator).hasClass('carrito-item')) {
                idCarrito = iterator.id
                for (const productos of productos_data) {
                    if (idCarrito === productos.identificador) {
                        productosComprados.push(productos)
                        sessionStorage.setItem('productoComprado_' + cero, JSON.stringify({productos}))
                    }
                }
            }
        }
        cero = 0
        precios = []
        for (const iterator of productosComprados) {
            cero++
            let cambioPrecio = iterator.precio * parseInt(dolarOficial())
            precios.push(cambioPrecio)
            productsEnCompra(iterator, $('.productos_finalizarCompra'))
        }
        let precioTotal = precios.reduce((a, b) => a + b, 0);
        $('.total').append('<p>'+precioTotal+'</p>')
        let optionsCuotas = [ 1, 3, 6, 12 ];
        for (var i = 0; i < optionsCuotas.length; i++) {
            funcionCuotas(precioTotal, i, optionsCuotas[i])
        }
        totalProductos.push(precioTotal)
    });


    $('body').on('submit', '.finalizarCompraForm', function(e){
        let nombre =  e.target[0].value;
        let email =  e.target[1].value;
        let tel =  e.target[2].value;
        let cuotas =  e.target[3].value.replaceAll('_', ' Cuotas de: $');
        let creditCardNumber =  e.target[4].value;
        let creditCardName =  e.target[5].value;
        let creditCardCVC =  e.target[6].value;
        let creditCardDesde =  e.target[7].value;
        let credictCardHasta =  e.target[8].value;
        let url = "https://jsonplaceholder.typicode.com/posts";
        new Client
     (nombre, email, tel, productosComprados)
        
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                nombre: nombre,
                email: email,
                tel: tel,
                cuotas: cuotas,
                creditCardNumber: creditCardNumber,
                creditCardName: creditCardName,
                creditCardCVC: creditCardCVC,
                creditCardDesde: creditCardDesde,
                credictCardHasta: credictCardHasta,
                dataProductosComprados: productosComprados,
                dataPrecioTotal: totalProductos[0],
            },
            beforeSend: function() {
                $('.finalizarCompra').html('')
                $('.finalizarCompra').addClass('compraFinalizada')
                $('.finalizarCompra.compraFinalizada').removeClass('finalizarCompra')
                $(cargando).removeClass('col-md-10');
                $(cargando).addClass('col-md-12');
                $('.compraFinalizada').append(cargando)
                $('#loader').removeClass('hidden')
            },
            success: function (data) {
                compraRealizadaConExito(data)
            },
            complete: function () { 
                $('#loader').addClass('hidden')
            }
        });
    });
});


//PRECIOS
let dolarOficial = () => {
    for (const dolares of dolar_Json) {
        let tipoDolar = dolares.casa.nombre
        let valorDolar = dolares.casa.venta
        if (tipoDolar === 'Dolar Oficial') {
            let valorDolarOficial = parseInt(valorDolar)
            return valorDolarOficial
        }
    }
}

//ESTRUCTURA CADA PRODUCTO
let crearEstructura =  (producto, donde) => {
    let precioPesos = dolarOficial() * producto.precio
    let nombreFoto = producto.nombre.replaceAll(' ', '_')
    let estructuraBasica = $(`
        <div class="elProduct fadeIn ${producto.identificador}">
            <h4>${producto.nombre}</h4>
            <img class="imgResponsive" src="img/productos/${nombreFoto}.jpg" >
            <div class="justify-content-between align-items-center">
                <h4>Descripcion:</h4>
                <p>Material: ${producto.especificaciones.Material}</p>
                <p>Tamaño: ${producto.especificaciones.Tamaño}</p>
                <a class="btn btn-primary agregar">Agregar</a>
                <p class="precio">${precioPesos} </p>
            </div>
        </div>'
    `
        
    );
    $(donde).append(estructuraBasica);
}

//NOTIFICACION
let crearNoti = (nombre, precio, clase, texto) => {
    let nuevaNotif = $(`
            <div class="toast d-flex flex-column justify-self-end ${clase}">
            <div class="toastInner">
                <p>Producto  ${texto}  carrito: </p>
                <p> ${nombre} </p>
                <p> ${precio} </p>
            </div>
            <div class="close">
                <a>Cerrar</a>
            </div>
        </div>
    `
    )
    $('.toastContainer').append(nuevaNotif);
    setTimeout(()=>{ 
        $(nuevaNotif).addClass('hide');
        setTimeout(()=>{
            $(nuevaNotif).remove()
        }, 1000);
    }, 5000);
}

let crearProductCarrito = (donde, nombre, precio, imagen, productoId) => {
    let nuevoProductoEnCarrito = $(`
        <div id="${productoId}" class="d-flex flex-row carrito-item justify-content-between">
            <img src="img/productos/${imagen}.jpg" >
            <div>
                <p class="carritoNombre">${nombre}</p>
                <p class="carritoPrecio">${precio}</p>
            </div>
            <a class="btn btn-danger quitar">-</a>
        </div>
    `
    ).fadeIn(3000);
    $(donde).prepend(nuevoProductoEnCarrito);
};

let cerrarNoti = () => {
    $('.toast a').click(function (e) { 
        e.stopPropagation();
        $(this).parent().parent().addClass('hide')
        setTimeout(function(){ 
            $(e.target.parentElement.parentElement).remove()
        }, 1000)
    });
};

let productsEnCompra = (producto, donde) => {
    let imagen = producto.nombre.replaceAll(' ', '_')
    let precioPesos = parseInt(producto.precio) * parseInt(dolarOficial())
    let productoDiv = $(`
        <div class="producto_finalizarCompra">
            <img src="img/productos/${imagen}.jpg" alt="">
            <p>${producto.nombre}</p>
            <p>${precioPesos}</p>
        </div>
        <hr>
    `
        
    )
    donde.prepend(productoDiv)
};

let funcionCuotas = (precioTotal, indice, cantidadCuotas) => {
    let precioTotalCuotas = precioTotal / cantidadCuotas;
    let value = cantidadCuotas + '_' + precioTotalCuotas.toFixed(2);
    let concatenacionHMLT = cantidadCuotas + ' Pagos de $ ' + precioTotalCuotas.toFixed(2);
    let concatenacionSelector = '.cuotas option:nth-child(' + ( indice + 1 ) + ')';
    $(concatenacionSelector).val(value)
    $(concatenacionSelector).html(concatenacionHMLT);
};

let compraRealizadaConExito = (data) => {
    let last4TC = data.creditCardNumber.substr(16)
    let mensajeCompra =  `
        <div class="col-md-12">
            <h3>¡Gracias <span class="gColor">${data.nombre}</span> por elegirnos!</h3>
            <p>¡El pago fue realizado con éxito!</p>
            <p>Corroborá las instrucciones de retiro en tu correo: <span class="gColor">${data.email}</span></p>
            <p>Pagaste $ ${data.dataPrecioTotal} en ${data.cuotas}</p>
            <p>Con la tarjeta número: **** - **** - **** - ${last4TC}</p>
        </div>
    `;
    $('.compraFinalizada').append(mensajeCompra)
} 