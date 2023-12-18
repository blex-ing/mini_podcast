import requests
from bs4 import BeautifulSoup

import requests
from bs4 import BeautifulSoup

def obtener_texto_de_url(url):
    """Obtiene el texto de una url.

    Args:
        url (str): La URL de la página web de la cual se desea obtener el texto.

    Returns:
        str: El texto extraído de la página web.

    """
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    texto = soup.get_text()
    return texto


texto = obtener_texto_de_url('https://www.msn.com/es-es/noticias/other/la-ley-de-inteligencia-artificial-llega-a-europa-pero-aspira-a-tener-una-vocaci%C3%B3n-global/ar-AA1lELQf')
print(texto)