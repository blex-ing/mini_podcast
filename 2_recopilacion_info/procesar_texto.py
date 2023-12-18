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


texto = obtener_texto_de_url('https://www.msn.com/es-es/noticias/espana/cuca-gamarra-s%C3%A1nchez-quiere-una-foto-con-feij%C3%B3o-para-blanquear-otras/ar-AA1lEKNR')
print(texto)