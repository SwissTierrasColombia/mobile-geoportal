import serverConfig from './config';
console.log(serverConfig.url);

import GeoJSON from 'ol/format/geojson';
import SourceVector from 'ol/source/vector';

import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';

import LayerVector from 'ol/layer/vector';

import Loadingstrategy from 'ol/loadingstrategy';
import Tilegrid from 'ol/tilegrid';

// format used to parse WFS GetFeature responses
var geojsonFormat = new GeoJSON();

var serviceSource = new SourceVector({
  loader: function(extent, resolution, projection) {
    //console.log('bad extent', extent, resolution, projection);
    var newExtent = window.map.getView().calculateExtent(window.map.getSize());
    //console.log('new extent', newExtent);
    //extent = newExtent.join(',');
    extent = newExtent;

    var url = serverConfig.url + '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857'
    // use jsonp: false to prevent jQuery from adding the "callback"
    // parameter to the URL
    $.ajax({url: url, dataType: 'json', jsonp: false}).done(function(response) {
      serviceSource.addFeatures(geojsonFormat.readFeatures(response))
    });
  },
  strategy: Loadingstrategy.tile(Tilegrid.createXYZ({maxZoom: 19}))
});

var serviceLayer = new LayerVector({
  source: serviceSource,
  style: styleFunction
});

window.map.addLayer(serviceLayer);


var image = new Circle({
  radius: 5,
  fill: null,
  stroke: new Stroke({
    color: 'red',
    width: 1
  })
});

var styles = {
  'Point': new Style({
    image: image
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1
    })
  }),
  'MultiPoint': new Style({
    image: image
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new Fill({
      color: 'magenta'
    }),
    image: new Circle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta'
      })
    })
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};

var styleFunction = function(feature) {
  return styles[feature.getGeometry().getType()];
};


window.masInformacion = function(id) {
   var url = 'https://ide.proadmintierra.info/odk/odk_p.php?id=' + id;
   $.ajax({url: url, dataType: 'json', jsonp: true}).done(function(response) {
      console.log(response);
   });

   var properties = {
        "numero": "5200",
        "direccion": "Santa Lucia",
        "numero_viejo": "87878787878787878787",
        "clasepredio": "Privado",
        "clasesuelo": null,
        "condicionpredio": "Formal",
        "comuna": null,
        "departamento": "25",
        "derechodelpredio": "Propiedad",
        "disponibilidaddelaoferta": null,
        "estratosocieconomico": null,
        "municipio": "394",
        "obrainfrainteriorlist": null,
        "observaciones": null,
        "opcionpredio": "Comunidad",
        "territoriosagricolas": null,
        "tipoderecho": null,
        "tipodocumento": null,
        "tipofuenteagulist": null,
        "tipopersona": null,
        "tipopredio": "Rural",
        "titulardelpredio": null
    };

    var content = document.getElementById('contenido-barra-lateral');
    var contentHTML = '';
    for (var property in properties) {
      if (properties.hasOwnProperty(property)) {
          contentHTML += '<p>' + property + ': ' + properties[property] + '</p>';
      }
    }

    content.innerHTML = contentHTML;
}
