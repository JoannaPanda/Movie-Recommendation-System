from pyquery import PyQuery as pq
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
import time, random, string
import xlsxwriter as xw
import json, os
import urllib.request
import re

#store all movie info
all_movie_info = []
#store all movie reviews
all_movie_reviews = []
#store all users
all_user = []
# store default cast image
default_cast_img = "https://images.fandango.com/cms/assets/b0cefeb0-b6a8-11ed-81d8-51a487a38835--poster-default-thumbnail.jpg"
# init browser
options = webdriver.ChromeOptions()
options.add_argument(
    'user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36')
browser = webdriver.Chrome(options=options)


def explore_detail(in_movie_info):
    browser.get(in_movie_info['link'])
    doc = pq(browser.page_source)

    # movie name and info
    in_movie_info['name'] = doc('[data-qa="score-panel-movie-title"]').text()
    print('Movie name:' + in_movie_info['name'])
    movie_dir = "./pic/" + in_movie_info['name'].replace(":", "") + "/"
    if not os.path.exists(movie_dir):
        os.makedirs(movie_dir)

    in_movie_info['briefing'] = in_movie_info['name']

    # poster img tag
    in_movie_info['cover_picture'] = doc('div.movie-thumbnail-wrap img').attr('src')
    
    # download_pic(movie_dir, in_movie_info['name'].replace(":", "") + ".jpg", in_movie_info['cover_picture'])

    # director
    in_movie_info['director'] = doc('[data-qa="movie-info-director"]').text()

    # movie genre & tag & release date
    movie_section = doc('[data-qa="movie-info-section"]')
    producer_labels = movie_section.find('[data-qa="movie-info-item-label"]').items()
    # producer_labels = movie_section.find('[data-qa="movie-info-item-label"]').items()
    

    in_movie_info['tag'] = ''
    in_movie_info['genre'] = ''
    in_movie_info['detail'] = ''
    in_movie_info['release_date'] = ''
    in_movie_info['tag'] = ''

    ###get rating
    # select the <b> element containing the rating label
    rating_label = doc('b[data-qa="movie-info-item-label"]:contains("Rating:")')

    # extract the rating value from the next sibling element
    rating_value = rating_label.next('.info-item-value').text()
    p1 = re.compile(r"[(](.*?)[)]", re.S)
    tags = re.findall(p1, rating_value)
    if len(tags) > 0:
        in_movie_info['tag'] = tags[0].replace('|', ',')
    

    ###get original language
    # select the <b> element containing the original language label
    language_label = doc('b[data-qa="movie-info-item-label"]:contains("Original Language:")')

    # extract the language value from the next sibling element
    language_value = language_label.next('.info-item-value').text()
    if len(in_movie_info['tag']) == 0:
        in_movie_info['tag'] = language_value
    else:
        in_movie_info['tag'] = in_movie_info['tag'] + "," + language_value

    ###get genre
    # select the <b> element containing the genre label
    genre_label = doc('b[data-qa="movie-info-item-label"]:contains("Genre:")')

    # extract the genre value from the next sibling element
    genre_value = genre_label.next('.info-item-value').text()
   
    #split the genre_value string into a list of genres
    genres_list = genre_value.split(', ')

    # extract the first genre and append the rest to genre_list
    genre_value = genres_list[0]
    in_movie_info['genre'] = genre_value

    # append the rest of the genres to in_movie_info['tag']
    for genre in genres_list[1:]:
        in_movie_info['tag'] = in_movie_info['tag'] + ',' + genre

    

    ###get release date
    # select the <b> element containing the release date label
    release_date_label = doc('b[data-qa="movie-info-item-label"]:contains("Release Date (Theaters):")')

    # extract the release date value from the next sibling element
    release_date_value = release_date_label.next('.info-item-value').text()
    release_date_value = release_date_value.replace('\xa0wide', '')
    in_movie_info['release_date'] = release_date_value

    #older version old, no longer used as the website has changed
    # for item in producer_labels:
    #     print(item.text())
    #     if 'Rating:' == item.text():
    #         # rating_text = item.siblings('.info-item-value').text()
    #         rating_text = item.siblings('.meta-value').text()
    #         p1 = re.compile(r"[(](.*?)[)]", re.S)
    #         tags = re.findall(p1, rating_text)
    #         if len(tags) > 0:
    #             in_movie_info['tag'] = tags[0].replace('|', ',')
    #     if "Original Language:" == item.text():
    #         language = item.siblings('.meta-value').text()
    #         if len(in_movie_info['tag']) == 0:
    #             in_movie_info['tag'] = language
    #         else:
    #             in_movie_info['tag'] = in_movie_info['tag'] + "," + language
    #     if 'Genre:' == item.text():
    #         in_movie_info['genre'] = item.siblings('.meta-value').text()
    #     if 'Release Date (Theaters):' == item.text():
    #         in_movie_info['release_date'] = item.siblings('.meta-value').text()

    # movie detail
    # in_movie_info['detail'] = movie_section.find('#movieSynopsis').text()
    in_movie_info['detail'] = doc('[data-qa="movie-info-synopsis"]').text()

    # director
    producer_str = ''
    in_movie_info['producer'] = ''
    try:
        show_more_button = browser.find_element('id', 'showMoreCastAndCrew')
        if show_more_button.is_displayed():
            show_more_button.click()
    except Exception as e:
        print("no show_more_button")
    cast_items = doc('.cast-and-crew-item').items()
    for cast in cast_items:
        cast_name = cast.find('p:first-child').text().strip()
        producer_str = producer_str + cast_name + ","
        cast_img_url = cast.find('img').attr('src')
        if cast_img_url != default_cast_img:
            download_pic(movie_dir, cast_name + ".jpg", cast_img_url)
    in_movie_info['producer'] = producer_str[:-1]
    print('all downloadable cast')

    # get all reviews
    explore_reviews(in_movie_info['id'], in_movie_info['link'] + '/reviews?type=user')


def explore_reviews(movie_id, review_url):
    this_movie_reviews = []
    browser.get(review_url)
    review_index = 0
    reviewer_index = 0
    for i in range(30):
        html = browser.page_source
        doc = pq(html)
        audience_reviews = doc('.audience-review-row').items()
        for review_item in audience_reviews:
            reviewer = review_item.find('[data-qa="review-name"]').text()
            if len(reviewer) == 0 or len(reviewer.strip()) == 0:
                continue
            user = {
                'user_id': reviewer_index,
                'user_name': reviewer,
                'user_email': random_char(8) + "@gmail.com"
            }
            all_user.append(user)
            reviewer_index = reviewer_index + 1

            review = review_item.find('[data-qa="review-text"]').text()
            filled_star = review_item.find('.star-display__filled').length
            half_star = review_item.find('.star-display__half').length
            this_movie_reviews.append({
                'review_id': review_index,
                'movie_id': movie_id,
                'reviewer_id': user['user_id'],
                'review_content': review,
                'star': filled_star + half_star
            })
            review_index = review_index + 1

        # sleep a few seconds to prevent IP from being blocked
        # time.sleep(random.random() * 4)
        # click next page
        try:
            print("get reviews for page %d" % i)
            # next_button = browser.find_element('class name', 'js-prev-next-paging-next')
            next_button = browser.find_element('xpath', '//rt-button[@data-paginationmanager="btnNext:click"]')
            if not next_button.is_displayed():
                break
            next_button.click()
        except Exception as e:
            break

        # wait for the page for 5 seconds
        WebDriverWait(browser, 5)
    all_movie_reviews.append(this_movie_reviews)


def xw_to_excel(workbook, sheet_name, title, all_data):
    worksheet1 = workbook.add_worksheet(sheet_name)
    worksheet1.activate()
    worksheet1.write_row('A1', title)
    i = 2  # write from row 2
    for j in range(len(all_data)):
        insert_data = all_data[j]
        row = 'A' + str(i)
        worksheet1.write_row(row, insert_data)
        i += 1


def random_char(y):
    return ''.join(random.choice(string.ascii_letters) for x in range(y))


def download_pic(path, name, url):
    if url is None:
        return
    with urllib.request.urlopen(url, timeout=30) as response, open(path + name, 'wb') as f_save:
        f_save.write(response.read())
        f_save.flush()
        f_save.close()


if __name__ == '__main__':
    if not os.path.exists("./pic"):
        os.makedirs("./pic")
    index = 0
    with open('listtest.json') as movie_list:
        movies = json.load(movie_list)
        for movie_url in movies:
            print('movielink:' + movie_url)
            movie_info = {'id': index}
            index = index + 1
            # click the movie link to enter the movie detail page
            movie_info['link'] = movie_url
            explore_detail(movie_info)
            all_movie_info.append(movie_info)
    browser.close()
    # generate table
    file_name = "datacollection.xlsx"
    workbook = xw.Workbook(file_name)
    output_movie_info = []
    output_movie_title = ['MovieId', 'MoveName', 'Director', 'Cast', 'ReleaseDate', 'CoverLink', 'Intro', 'MovieDeatails', 'genre', 'tag']
    for j in range(len(all_movie_info)):
        output_movie_info.append([all_movie_info[j]["id"], all_movie_info[j]["name"], all_movie_info[j]["director"],
                                  all_movie_info[j]["producer"], all_movie_info[j]["release_date"],
                                  all_movie_info[j]["cover_picture"],
                                  all_movie_info[j]["briefing"], all_movie_info[j]["detail"],
                                  all_movie_info[j]["genre"], all_movie_info[j]["tag"]])
    xw_to_excel(workbook, "Movie", output_movie_title, output_movie_info)

    output_review_info = []
    review_id = 0
    output_review_title = ['ReviewId', 'UserId', 'MovieId', 'Rating0-5', 'Comments']
    for j in range(len(all_movie_reviews)):
        unique_reviews = []
        review_content_set = set()
        this_movie_reviews = all_movie_reviews[j]
        for review in this_movie_reviews:
            if review['review_content'] not in review_content_set:
                unique_reviews.append(review)
                review_content_set.add(review['review_content'])
        for h in range(len(unique_reviews)):
            review_id = review_id + 1
            output_review_info.append([review_id, unique_reviews[h]["reviewer_id"],
                                       unique_reviews[h]["movie_id"], unique_reviews[h]["star"],
                                       unique_reviews[h]["review_content"]])

    xw_to_excel(workbook, "Reviews", output_review_title, output_review_info)

    output_user_info = []
    output_user_title = ['UserId', 'UserName', 'UserEmail']
    for j in range(len(all_movie_reviews)):
        output_user_info.append([all_user[j]["user_id"], all_user[j]["user_name"], all_user[j]["user_email"]])
    xw_to_excel(workbook, "User", output_user_title, output_user_info)
    workbook.close()
