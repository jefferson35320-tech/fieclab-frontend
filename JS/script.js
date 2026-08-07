const products = [

    {
        id: 1,
        name: "Sabonete Líquido",
        image: "img/sabonete.jpg",
        stock: 15,

        options: [
            {size:"315ML", price:8},
            {size:"2 Litros", price:25},
            {size:"Kit", price:30}
        ],

        scents: [
            "Alfazema",
            "Aveia e Mel",
            "Chá Verde",
            "Capim Limão"
        ]
    },

    {
        id:2,
        name:"Desinfetante",
        image:"img/desinfetante.jpg",
        stock:42,

        options:[
            {size:"2 Litros",price:7},
            {size:"5 Litros",price:17}
        ],

        scents:[
            "Algas",
            "Algodão",
            "Lavanda",
            "Talco"
        ]
    },

    {
        id:3,
        name:"Detergente",
        image:"img/detergente.jpg",
        stock:50,

        options:[
            {size:"500ML",price:2.50},
            {size:"5 Litros",price:25}
        ],

        scents:[
            "Coco",
            "Laranja",
            "Limão",
            "Neutro"
        ]
    },

    {
        id:4,
        name:"Álcool Gel",
        image:"img/alcoolgel.jpg",
        stock:20
    },

    {
        id:5,
        name:"Multiuso",
        image:"img/multiuso.jpg",
        stock:0,
        status:"PRODUCAO"
    },

    {
        id:6,
        name:"Amaciante",
        image:"img/amaciante.jpg",
        stock:12
    },

    {
        id:7,
        name:"Sabão Líquido",
        image:"img/sabaoliquido.jpg",
        stock:8
    },

    {
        id:8,
        name:"Limpa Vidros",
        image:"img/limpavidros.jpg",
        stock:25
    },

    {
        id:9,
        name:"Creme Dores Musculares",
        image:"img/creme-dores.jpg",
        stock:0,
        status:"INDISPONIVEL"
    },

    {
        id:10,
        name:"Creme Para as Mãos",
        image:"img/creme-maos.jpg",
        stock:18
    },

    {
        id:11,
        name:"Água para Lençóis",
        image:"img/agua-lencois.jpg",
        stock:5
    },

    {
        id:12,
        name:"Loção Repelente",
        image:"img/locao-repelente.jpg",
        stock:10
    },

    {
        id:13,
        name:"Repelente Spray",
        image:"img/repelente-spray.jpg",
        stock:14
    }

];

let cart=[];


function renderCatalog(){

    const catalog =
    document.getElementById("catalog");

    catalog.innerHTML="";

    products.forEach(function(p){

        let stockHtml=
        '<span class="stock-tag stock-available">' +
        'Estoque: '+ p.stock +
        ' unidades</span>';

        let actionHtml=
        '<button class="btn btn-add" onclick="addToCart('+p.id+')">' +
        'Adicionar ao Carrinho' +
        '</button>';



        if(p.status=="PRODUCAO"){

            stockHtml=
            '<span class="stock-tag stock-warning">' +
            'Em produção: disponível em 7 dias úteis' +
            '</span>';

        }


        if(p.status=="INDISPONIVEL"){

            stockHtml=
            '<span class="stock-tag stock-none">' +
            'Produto indisponível' +
            '</span>';

            actionHtml=

            '<div class="notify-box">'+

            '<label>' +
            'Me avise quando estiver disponível:'+
            '</label>'+

            '<input type="email" '+
            'placeholder="Seu e-mail..." '+
            'id="email-'+p.id+'">'+

            '<button class="btn btn-notify">' +
            'Enviar'+
            '</button>'+

            '</div>';
        }



        let optionsHTML="";

        if(p.options){

            p.options.forEach(function(opt,i){

                optionsHTML +=

                '<option value="'+i+'">'+
                opt.size+
                '</option>';

            });

        }



        let scentSelect="";

        if(p.scents){

            scentSelect=

            '<div class="form-group">'+

            '<label>Aroma:</label>'+

            '<select id="scent-'+p.id+'">'+

            p.scents.map(function(s){

                return '<option>'+s+'</option>';

            }).join("")

            +

            '</select>'+

            '</div>';

        }



        let preco="";

        if(p.options){

            preco=

            '<div class="price-tag" id="price-'+p.id+'">' +

            'R$ '+

            p.options[0].price
            .toFixed(2)
            .replace(".",",")

            +

            '</div>';

        }



        catalog.innerHTML +=

        '<div class="product-card">' +

        '<img src="'+p.image+'" class="product-image">' +

        stockHtml +

        '<div class="product-title">'+
        p.name+
        '</div>'+

        (p.options ?

        '<div class="form-group">'+

        '<label>Tamanho:</label>'+

        '<select id="size-'+p.id+'" onchange="updatePrice('+p.id+')">'+

        optionsHTML +

        '</select>'+

        '</div>'

        : '')

        +

        scentSelect +

        preco +

        actionHtml +

        '</div>';

    });

}



function updatePrice(id){

    const p=
    products.find(function(x){

        return x.id==id;

    });

    let idx=

    document.getElementById(
    "size-"+id
    ).value;


    document.getElementById(
    "price-"+id
    ).innerText=

    "R$ "+

    p.options[idx]
    .price
    .toFixed(2)
    .replace(".",",");

}



function addToCart(id){

    const p=

    products.find(function(x){

        return x.id==id;

    });

    if(!p.options){

        return;
    }

    let sizeIdx=

    document.getElementById(
    "size-"+id
    ).value;

    let opt=
    p.options[sizeIdx];


    let scent="";


    if(
    document.getElementById(
    "scent-"+id
    )){

        scent=

        document.getElementById(
        "scent-"+id
        ).value;

    }


    cart.push({

        name:p.name,
        size:opt.size,
        price:opt.price,
        scent:scent

    });

    updateCartUI();

    toggleCart(true);

}



function updateCartUI(){

    let body=

    document.getElementById(
    "cartBody"
    );

    body.innerHTML="";

    let total=0;


    if(cart.length==0){

        body.innerHTML=
        "<p>Vazio</p>";

    }


    cart.forEach(function(item){

        total+=item.price;

        body.innerHTML+=

        '<div style="margin-bottom:10px">' +

        '<strong>'+
        item.name+
        '</strong>'+

        ' ('+item.size+')'+

        '<br>'+

        '<small>'+
        item.scent+
        '</small>'+

        ' - R$ '+
        item.price.toFixed(2)

        +

        '</div>';

    });



    document.getElementById(
    "cart-count"
    ).innerText=cart.length;


    document.getElementById(
    "cart-total"
    ).innerText=

    "R$ "+

    total
    .toFixed(2)
    .replace(".",",");

}



function toggleCart(forceOpen=false){

    const sidebar=

    document.getElementById(
    "cartSidebar"
    );

    if(forceOpen){

        sidebar.classList.add(
        "active"
        );

    }

    else{

        sidebar.classList.toggle(
        "active"
        );

    }

}



function showFinalModal(){

    if(cart.length==0){

        alert(
        "Carrinho vazio"
        );

        return;
    }

    document.getElementById(
    "successModal"
    ).style.display="flex";

}

window.onload=renderCatalog;