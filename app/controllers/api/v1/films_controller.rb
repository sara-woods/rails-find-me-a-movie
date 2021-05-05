class Api::V1::FilmsController < Api::V1::BaseController
  def search
    # url = "https://www.imdb.com/search/title/?title_type=feature&release_date=2020-01-01,2021-01-01&user_rating=1.0,&genres=animation"

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

      film_hash = {
        title: title,
        year: year,
        rating: rating,
        length: length,
        genres: genres,
        poster_url: poster_url
      }

      film_hashes_array << film_hash
      
    end

    puts film_hashes_array
    render json: film_hashes_array
  end

end