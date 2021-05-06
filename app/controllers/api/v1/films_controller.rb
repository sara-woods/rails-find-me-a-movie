class Api::V1::FilmsController < Api::V1::BaseController
  def search
    url = params[:url]

    html_file = URI.open(url).read
    html_doc = Nokogiri::HTML(html_file)

    film_hashes_array = []

    html_doc.search('.lister-item').each do |film|
      title = film.search('.lister-item-content h3 a')&.text.strip
      year = film.search('.lister-item-year')&.text&.match(/\d+/)[0]
      poster_url = film.search('.lister-item-image a img')&.attribute('src')&.value
      rating = film.search('.ratings-imdb-rating')&.attribute('data-value')&.value
      length = film.search('.runtime')&.text.strip
      genres = film.search('.genre')&.text.strip
      movie_url = film.search('.lister-item-header a')&.attribute('href')&.value
      description = film.search('.lister-item-content p:nth-of-type(2)')&.text.strip

      description = "" if description.match?(/Directors?:/)
      id = movie_url.match(/\/title\/(.+)\//)[1]
      movie_url = "https://www.imdb.com#{movie_url}"
      genres = genres.split(", ")      

      film_hash = {
        id: id,
        title: title,
        year: year,
        rating: rating,
        length: length,
        genres: genres,
        poster_url: poster_url,
        description: description,
        movie_url: movie_url
      }

      film_hashes_array << film_hash
      
    end

    render json: film_hashes_array
  end
end