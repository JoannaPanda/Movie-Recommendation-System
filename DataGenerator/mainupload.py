from pyquery import PyQuery as pq
from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
import time, random, string
import xlsxwriter as xw
import json, os
import urllib.request

# Store all movie information
all_movie_info = []
# Store all movie reviews information
all_movie_reviews = []
# Store all user information
all_user = []
# Default actor images
default_cast_img = "https://images.fandango.com/cms/assets/b0cefeb0-b6a8-11ed-81d8-51a487a38835--poster-default-thumbnail.jpg"
# Initialize the browser
options = webdriver.ChromeOptions()
options.add_argument(
    'user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36')
browser = webdriver.Chrome(options=options)


def explore_detail(in_movie_info):
    browser.get(in_movie_info['link'])
    doc = pq(browser.page_source)

    # Movie title and synopsis
    movie_info['name'] = doc('[data-qa="score-panel-movie-title"]').text()
    print('MovieName' + movie_info['name'])
    movie_dir = "./pic/" + movie_info['name'] + "/"
    if not os.path.exists(movie_dir):
        os.makedirs(movie_dir)

    movie_info['briefing'] = movie_info['name']

    # img tag for the movie poster image

    movie_info['cover_picture'] = doc('img.posterImage').attr('src')
    download_pic(movie_dir, movie_info['name'] + ".jpg", movie_info['cover_picture'])

    # Director
    in_movie_info['director'] = doc('[data-qa="movie-info-director"]').text()

    # Genre, tags, and release date of the movie
    movie_section = doc('[data-qa="movie-info-section"]')
    producer_labels = movie_section.find('[data-qa="movie-info-item-label"]').items()
    in_movie_info['tag'] = ''
    in_movie_info['genre'] = ''
    in_movie_info['detail'] = ''
    movie_info['release_date'] = ''

    for item in producer_labels:
        if 'Rating:' == item.text():
            in_movie_info['tag'] = item.siblings('.meta-value').text()
        if 'Genre:' == item.text():
            in_movie_info['genre'] = item.siblings('.meta-value').text()
        if 'Release Date (Theaters):' == item.text():
            movie_info['release_date'] = item.siblings('.meta-value').text()

    # Detailed information about the movie
    in_movie_info['detail'] = movie_section.find('#movieSynopsis').text()

    # Actor
    producer_str = ''
    in_movie_info['producer'] = ''
    try:
        show_more_button = browser.find_element('id', 'showMoreCastAndCrew')
        if show_more_button.is_displayed():
            show_more_button.click()
    except Exception as e:
        print("no show_more_button")
    cast_items = doc('.cast-item.media.inlineBlock').items()
    for cast in cast_items:
        cast_name = cast.find('span:first-child').text().strip()
        producer_str = producer_str + cast_name + ","
        cast_img_url = cast.find('img').attr('src')
        if cast_img_url != default_cast_img:
            download_pic(movie_dir, cast_name + ".jpg", cast_img_url)
    in_movie_info['producer'] = producer_str[:-1]
    print('All downloadable pictures')

    # Get review info
    explore_reviews(in_movie_info['id'], in_movie_info['link'] + '/reviews?type=user')


def explore_reviews(movie_id, review_url):
    browser.get(review_url)
    review_index = 0
    reviewer_index = 0
    for i in range(30):
        html = browser.page_source
        doc = pq(html)
        audience_reviews = doc('.audience-review-row').items()
        for review_item in audience_reviews:
            reviewer = review_item.find('[data-qa="review-name"]').text()
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
            all_movie_reviews.append({
                'review_id': review_index,
                'movie_id': movie_id,
                'reviewer_id': user['user_id'],
                'review_content': review,
                'star': filled_star + half_star
            })
            review_index = review_index + 1

        # Prevent IP blocking by sleeping for a random number of seconds
        # time.sleep(random.random() * 4)
        # Simulate clicking on the next page
        try:
            print("get comments for page:%d" % i)
            next_button = browser.find_element('class name', 'js-prev-next-paging-next')
            if not next_button.is_displayed():
                break
            next_button.click()
        except Exception as e:
            break

        # Wait for 5 seconds for the browser to load the page
        WebDriverWait(browser, 5)


def xw_to_excel(workbook, sheet_name, title, all_data):
    worksheet1 = workbook.add_worksheet(sheet_name)
    worksheet1.activate()
    worksheet1.write_row('A1', title)
    i = 2  
    for j in range(len(all_data)):
        insert_data = all_data[j]
        row = 'A' + str(i)
        worksheet1.write_row(row, insert_data)
        i += 1


def random_char(y):
    return ''.join(random.choice(string.ascii_letters) for x in range(y))


def download_pic(path, name, url):
    with urllib.request.urlopen(url, timeout=30) as response, open(path + name, 'wb') as f_save:
        f_save.write(response.read())
        f_save.flush()
        f_save.close()


if __name__ == '__main__':
    if not os.path.exists("./pic"):
        os.makedirs("./pic")
    index = 0
    with open('list.json') as movie_list:
        movies = json.load(movie_list)
        for movie_url in movies:
            print('MovieLink:' + movie_url)
            movie_info = {'id': index}
            index = index + 1
            # Movie link, click to enter the detail page.
            movie_info['link'] = movie_url
            explore_detail(movie_info)
            all_movie_info.append(movie_info)
    browser.close()
    # make excel
    file_name = "data1.xlsx"
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
    output_review_title = ['ReviewId', 'UserId', 'MovieId', 'Rating0-5', 'Comments']
    for j in range(len(all_movie_reviews)):
        output_review_info.append([all_movie_reviews[j]["review_id"], all_movie_reviews[j]["reviewer_id"],
                                   all_movie_reviews[j]["movie_id"], all_movie_reviews[j]["star"],
                                   all_movie_reviews[j]["review_content"]])
    xw_to_excel(workbook, "Reviews", output_review_title, output_review_info)

    output_user_info = []
    output_user_title = ['UserId', 'UserName', 'UserEmail']
    for j in range(len(all_movie_reviews)):
        output_user_info.append([all_user[j]["user_id"], all_user[j]["user_name"], all_user[j]["user_email"]])
    xw_to_excel(workbook, "User", output_user_title, output_user_info)
    workbook.close()



json = [
    "https://www.rottentomatoes.com/m/nightmare_alley",
    "https://www.rottentomatoes.com/m/brides_of_dracula",
    "https://www.rottentomatoes.com/m/breakfast_at_tiffanys",
    "https://www.rottentomatoes.com/m/1002352-big_sleep",
    "https://www.rottentomatoes.com/m/the_wizard_of_oz_1939",
    "https://www.rottentomatoes.com/m/lady_and_the_tramp",
    "https://www.rottentomatoes.com/m/mary_poppins",
    "https://www.rottentomatoes.com/m/the_little_mermaid_1989",
    "https://www.rottentomatoes.com/m/1015944-parent_trap",
    "https://www.rottentomatoes.com/m/1019187-sleeping_beauty",
    "https://www.rottentomatoes.com/m/pinocchio_1940",
    "https://www.rottentomatoes.com/m/dumbo",
    "https://www.rottentomatoes.com/m/1017699-robin_hood",
    "https://www.rottentomatoes.com/m/hercules",
    "https://www.rottentomatoes.com/m/mummies",
    "https://www.rottentomatoes.com/m/1029112-alice_in_wonderland",
    "https://www.rottentomatoes.com/m/pearl_2022",
    "https://www.rottentomatoes.com/m/news_of_the_world",
    "https://www.rottentomatoes.com/m/she_said",
    "https://www.rottentomatoes.com/m/the_hunger_games",
    "https://www.rottentomatoes.com/m/hereditary",
    "https://www.rottentomatoes.com/m/interstellar_2014",
    "https://www.rottentomatoes.com/m/black_crab",
    "https://www.rottentomatoes.com/m/blonde",
    "https://www.rottentomatoes.com/m/shazam",
    "https://www.rottentomatoes.com/m/promising_young_woman",
    "https://www.rottentomatoes.com/m/finding_michael",
    "https://www.rottentomatoes.com/m/elvis",
    "https://www.rottentomatoes.com/m/unseen_2023",
    "https://www.rottentomatoes.com/m/sword_in_the_stone",
  "https://www.rottentomatoes.com/m/infinity_pool_2023",
  "https://www.rottentomatoes.com/m/the_strays",
  "https://www.rottentomatoes.com/m/parasite_2019",
  "https://www.rottentomatoes.com/m/1003707-casablanca",
  "https://www.rottentomatoes.com/m/1000626-all_about_eve",
  "https://www.rottentomatoes.com/m/schindlers_list",
  "https://www.rottentomatoes.com/m/all_quiet_on_the_western_front",
  "https://www.rottentomatoes.com/m/the_godfather",
  "https://www.rottentomatoes.com/m/godfather_part_ii",
  "https://www.rottentomatoes.com/m/1009123-hamlet",
  "https://www.rottentomatoes.com/m/12_years_a_slave",
  "https://www.rottentomatoes.com/m/silence_of_the_lambs",
  "https://www.rottentomatoes.com/m/american_in_paris",
  "https://www.rottentomatoes.com/m/the_kings_speech",
  "https://www.rottentomatoes.com/m/my_fair_lady",
  "https://www.rottentomatoes.com/m/the_shape_of_water_2017",
  "https://www.rottentomatoes.com/m/west_side_story",
  "https://www.rottentomatoes.com/m/slumdog_millionaire",
  "https://www.rottentomatoes.com/m/departed",
  "https://www.rottentomatoes.com/m/million_dollar_baby",
  "https://www.rottentomatoes.com/m/gone_with_the_wind",
  "https://www.rottentomatoes.com/m/rain_man",
  "https://www.rottentomatoes.com/m/gandhi",
  "https://www.rottentomatoes.com/m/titanic",
  "https://www.rottentomatoes.com/m/last_emperor",
  "https://www.rottentomatoes.com/m/chicago",
  "https://www.rottentomatoes.com/m/english_patient",
  "https://www.rottentomatoes.com/m/sound_of_music",
  "https://www.rottentomatoes.com/m/green_book",
  "https://www.rottentomatoes.com/m/1065684-braveheart",
  "https://www.rottentomatoes.com/m/beautiful_mind",
  "https://www.rottentomatoes.com/m/forrest_gump",
  "https://www.rottentomatoes.com/m/broadway_melody",
  "https://www.rottentomatoes.com/m/1004177-cimarron",
  "https://www.rottentomatoes.com/m/avatar",
  "https://www.rottentomatoes.com/m/iron_man",
  "https://www.rottentomatoes.com/m/iron_man",
  "https://www.rottentomatoes.com/m/guardians_of_the_galaxy",
  "https://www.rottentomatoes.com/m/doctor_strange_2016",
  "https://www.rottentomatoes.com/m/iron_man_2",
  "https://www.rottentomatoes.com/m/eternals",
  "https://www.rottentomatoes.com/m/iron_man_3",
  "https://www.rottentomatoes.com/m/battlefield_earth",
  "https://www.rottentomatoes.com/m/ishtar",
  "https://www.rottentomatoes.com/m/this_is_where_i_leave_you",
  "https://www.rottentomatoes.com/m/ripd",
  "https://www.rottentomatoes.com/m/the_woman_king",
  "https://www.rottentomatoes.com/m/1020287-stranger",
  "https://www.rottentomatoes.com/m/365_days_2020",
  "https://www.rottentomatoes.com/m/scream_2022",
  "https://www.rottentomatoes.com/m/rocky_iv",
  "https://www.rottentomatoes.com/m/rocky_balboa",
  "https://www.rottentomatoes.com/m/prisoners_2013",
  "https://www.rottentomatoes.com/m/attachment",
  "https://www.rottentomatoes.com/m/m3gan",
  "https://www.rottentomatoes.com/m/everything_everywhere_all_at_once",
  "https://www.rottentomatoes.com/m/women_talking",
  "https://www.rottentomatoes.com/m/triangle_of_sadness",
  "https://www.rottentomatoes.com/m/the_banshees_of_inisherin",
  "https://www.rottentomatoes.com/m/toy_story_2",
  "https://www.rottentomatoes.com/m/leave_no_trace",
  "https://www.rottentomatoes.com/m/man_on_wire",
  "https://www.rottentomatoes.com/m/babylon_2022",
  "https://www.rottentomatoes.com/m/1003707-casablanca",
    "https://www.rottentomatoes.com/m/avatar_the_way_of_water",
    "https://www.rottentomatoes.com/m/terminator_dark_fate",
    "https://www.rottentomatoes.com/m/alita_battle_angel",
    "https://www.rottentomatoes.com/m/eating_you_alive",
    "https://www.rottentomatoes.com/m/beyond_glory_2016",
    "https://www.rottentomatoes.com/m/mission_blue",
    "https://www.rottentomatoes.com/m/deepsea_challenge_3d",
    "https://www.rottentomatoes.com/m/cirque_du_soleil_worlds_away",
    "https://www.rottentomatoes.com/m/ray_harryhausen_special_effects_titan",
    "https://www.rottentomatoes.com/m/sanctum",
    "https://www.rottentomatoes.com/m/exodus_decoded",
    "https://www.rottentomatoes.com/m/aliens_of_the_deep",
    "https://www.rottentomatoes.com/m/volcanoes-of-the-deep-sea",
    "https://www.rottentomatoes.com/m/ghosts_of_the_abyss",
    "https://www.rottentomatoes.com/m/muse",
    "https://www.rottentomatoes.com/m/dungeons_and_dragons_honor_among_thieves",
    "https://www.rottentomatoes.com/m/smoking_causes_coughing",
    "https://www.rottentomatoes.com/m/puss_in_boots_the_last_wish",
    "https://www.rottentomatoes.com/m/the_lost_king",
    "https://www.rottentomatoes.com/m/no_bears",
    "https://www.rottentomatoes.com/m/one_fine_morning_2022",
    "https://www.rottentomatoes.com/m/and_god_spoke",
    "https://www.rottentomatoes.com/m/2_in_the_bush_a_love_story",
    "https://www.rottentomatoes.com/m/27_el_club_de_los_malditos",
    "https://www.rottentomatoes.com/m/3_idiots",
    "https://www.rottentomatoes.com/m/5_25_77",
    "https://www.rottentomatoes.com/m/partie_de_campagne",
    "https://www.rottentomatoes.com/m/a_foreign_affair",
    "https://www.rottentomatoes.com/m/lesson_in_love",
    "https://www.rottentomatoes.com/m/a_mermaid_in_paris",
    "https://www.rottentomatoes.com/m/a_midsummer_nights_dream_2014",
    "https://www.rottentomatoes.com/m/about_pie",
    "https://www.rottentomatoes.com/m/abracadabra",
    "https://www.rottentomatoes.com/m/after_the_thin_man",
    "https://www.rottentomatoes.com/m/ali_wong_baby_cobra",
    "https://www.rottentomatoes.com/m/ali_wong_hard_knock_wife",
    "https://www.rottentomatoes.com/m/all_about_them",
    "https://www.rottentomatoes.com/m/all_hands_on_deck_2020",
    "https://www.rottentomatoes.com/m/andhadhun",
    "https://www.rottentomatoes.com/m/annie_live",
    "https://www.rottentomatoes.com/m/anthony_jeselnik_thoughts_and_prayers",
    "https://www.rottentomatoes.com/m/antiquities",
    "https://www.rottentomatoes.com/m/aqua_teen_forever_plantasm",
    "https://www.rottentomatoes.com/m/arlo_and_julie",
    "https://www.rottentomatoes.com/m/ashens_and_the_polybius_heist",
    "https://www.rottentomatoes.com/m/aspergers_are_us",
    "https://www.rottentomatoes.com/m/at_the_circus",
    "https://www.rottentomatoes.com/m/at_the_end_of_the_day_2018",
    "https://www.rottentomatoes.com/m/atlantic_city",
    "https://www.rottentomatoes.com/m/aurora_2019",
    "https://www.rottentomatoes.com/m/one_hundred_days_of_solitude",
    "https://www.rottentomatoes.com/m/thirty_six_quai_des_orfevres",
    "https://www.rottentomatoes.com/m/99_river_street",
    "https://www.rottentomatoes.com/m/a_man_escaped",
    "https://www.rottentomatoes.com/m/aqua_teen_forever_plantasm",
    "https://www.rottentomatoes.com/m/ashens_and_the_polybius_heist",
    "https://www.rottentomatoes.com/m/baby_assassins",
    "https://www.rottentomatoes.com/m/batman_beyond_return_of_the_joker",
    "https://www.rottentomatoes.com/m/batman_vs_teenage_mutant_ninja_turtles",
    "https://www.rottentomatoes.com/m/batman_and_superman_battle_of_the_super_sons",
    "https://www.rottentomatoes.com/m/batman_and_superman_battle_of_the_super_sons",
    "https://www.rottentomatoes.com/m/batman_the_dark_knight_returns_part_1_2012",
    "https://www.rottentomatoes.com/m/batman_bad_blood",
    "https://www.rottentomatoes.com/m/batman_the_long_halloween_part_one",
    "https://www.rottentomatoes.com/m/batman_under_the_red_hood",
    "https://www.rottentomatoes.com/m/breaking_surface",
    "https://www.rottentomatoes.com/m/brother_1997",
    "https://www.rottentomatoes.com/m/by_nights_end",
    "https://www.rottentomatoes.com/m/come_drink_with_me_2008",
    "https://www.rottentomatoes.com/m/cut_off_2018",
    "https://www.rottentomatoes.com/m/dead_end_2019",
    "https://www.rottentomatoes.com/m/dead_or_alive_2",
    "https://www.rottentomatoes.com/m/dune_drifter",
    "https://www.rottentomatoes.com/m/avatar_the_way_of_water",
    "https://www.rottentomatoes.com/m/murder_mystery_2",
    "https://www.rottentomatoes.com/m/avengers_endgame",
    "https://www.rottentomatoes.com/m/the_matrix_resurrections",
    "https://www.rottentomatoes.com/m/thor_love_and_thunder",
    "https://www.rottentomatoes.com/m/marvels_the_avengers",
    "https://www.rottentomatoes.com/m/jurassic_world_dominion",
    "https://www.rottentomatoes.com/m/zack_snyders_justice_league",
    "https://www.rottentomatoes.com/m/train_to_busan",
    "https://www.rottentomatoes.com/m/sonic_the_hedgehog_2020",
    "https://www.rottentomatoes.com/m/minions_the_rise_of_gru",
    "https://www.rottentomatoes.com/m/turning_red",
    "https://www.rottentomatoes.com/m/mrs_harris_goes_to_paris",
    "https://www.rottentomatoes.com/m/nope",
    "https://www.rottentomatoes.com/m/the_thing_2011",
    "https://www.rottentomatoes.com/m/star_wars_the_rise_of_skywalker",
    "https://www.rottentomatoes.com/m/star_wars_the_last_jedi",
    "https://www.rottentomatoes.com/m/acidman",
    "https://www.rottentomatoes.com/m/2001_a_space_odyssey",
    "https://www.rottentomatoes.com/m/captain_marvel",
    "https://www.rottentomatoes.com/m/blade_runner_2049",
    "https://www.rottentomatoes.com/m/tenet",
    "https://www.rottentomatoes.com/m/the_matrix_resurrections",
    "https://www.rottentomatoes.com/m/prey_2022",
    "https://www.rottentomatoes.com/m/ready_player_one",
    "https://www.rottentomatoes.com/m/inception",
    "https://www.rottentomatoes.com/m/batman_v_superman_dawn_of_justice",
    "https://www.rottentomatoes.com/m/the_meg",
    "https://www.rottentomatoes.com/m/knowing",
    "https://www.rottentomatoes.com/m/star_wars_episode_i_the_phantom_menace",
    "https://www.rottentomatoes.com/m/meet_cute_2022",
    "https://www.rottentomatoes.com/m/the_tomorrow_war",
    "https://www.rottentomatoes.com/m/space_oddity",
    "https://www.rottentomatoes.com/m/last_sentinel_2023",
    "https://www.rottentomatoes.com/m/clone_wars",
    "https://www.rottentomatoes.com/m/terminator_genisys",
    "https://www.rottentomatoes.com/m/the_giver",
    "https://www.rottentomatoes.com/m/fantastic_four_2015",
    "https://www.rottentomatoes.com/m/transformers_the_last_knight_2017",
    "https://www.rottentomatoes.com/m/transformers_age_of_extinction",
    "https://www.rottentomatoes.com/m/the_cloverfield_paradox",
    "https://www.rottentomatoes.com/m/the_fifth_wave",
    "https://www.rottentomatoes.com/m/chaos_walking",
    "https://www.rottentomatoes.com/m/on_a_wing_and_a_prayer_2023",
    "https://www.rottentomatoes.com/m/where_the_crawdads_sing",
    "https://www.rottentomatoes.com/m/marlowe_2022",
    "https://www.rottentomatoes.com/m/amsterdam_2022",
    "https://www.rottentomatoes.com/m/the_ritual_killer",
    "https://www.rottentomatoes.com/m/the_visitor_2022",
    "https://www.rottentomatoes.com/m/hunt_club",
    "https://www.rottentomatoes.com/m/ava_2020_2",
    "https://www.rottentomatoes.com/m/deep_water_2022",
    "https://www.rottentomatoes.com/m/terrifier",
    "https://www.rottentomatoes.com/m/prey_for_the_devil",
    "https://www.rottentomatoes.com/m/last_seen_alive",
    "https://www.rottentomatoes.com/m/mindcage",
    "https://www.rottentomatoes.com/m/the_unholy_2021",
    "https://www.rottentomatoes.com/m/air_2015",
    "https://www.rottentomatoes.com/m/1104385-hannibal",
    "https://www.rottentomatoes.com/m/one_missed_call",
    "https://www.rottentomatoes.com/m/the_woman_in_the_window_2020",
    "https://www.rottentomatoes.com/m/exodus_gods_and_kings",
    "https://www.rottentomatoes.com/m/medieval",
    "https://www.rottentomatoes.com/m/ben_hur_2016",
    "https://www.rottentomatoes.com/m/redeeming_love",
    "https://www.rottentomatoes.com/m/the_aftermath_2019",
    "https://www.rottentomatoes.com/m/alexander",
    "https://www.rottentomatoes.com/m/robe",
    "https://www.rottentomatoes.com/m/uss_indianapolis_men_of_courage",
    "https://www.rottentomatoes.com/m/the_lone_ranger",
    "https://www.rottentomatoes.com/m/stagecoach",
    "https://www.rottentomatoes.com/m/wild_wild_west",
    "https://www.rottentomatoes.com/m/the_last_son",
    "https://www.rottentomatoes.com/m/the_kid_2019",
    "https://www.rottentomatoes.com/m/young_guns",
    "https://www.rottentomatoes.com/m/skinwalker_2021",
    "https://www.rottentomatoes.com/m/pinocchio_2022",
    "https://www.rottentomatoes.com/m/oh_belinda",
    "https://www.rottentomatoes.com/m/pixels",
    "https://www.rottentomatoes.com/m/clone_wars",
    "https://www.rottentomatoes.com/m/last_airbender",
    "https://www.rottentomatoes.com/m/cat_in_the_hat",
    "https://www.rottentomatoes.com/m/ripd",
    "https://www.rottentomatoes.com/m/fantastic_four_2015",
    "https://www.rottentomatoes.com/m/transformers_the_last_knight_2017",
    "https://www.rottentomatoes.com/m/catwoman",
    "https://www.rottentomatoes.com/m/harry_potter_and_the_goblet_of_fire",
    "https://www.rottentomatoes.com/m/slumberland",
    "https://www.rottentomatoes.com/m/the_mummy_2017",
    "https://www.rottentomatoes.com/m/gods_of_egypt",
    "https://www.rottentomatoes.com/m/hellboy_2019",
    "https://www.rottentomatoes.com/m/the_dark_tower_2017",
    "https://www.rottentomatoes.com/m/green_lantern",
    "https://www.rottentomatoes.com/m/dolittle",
    "https://www.rottentomatoes.com/m/into_the_woods_2014",
    "https://www.rottentomatoes.com/m/the_witches_2020",
    "https://www.rottentomatoes.com/m/pacific_rim_uprising",
    "https://www.rottentomatoes.com/m/ghost_rider_spirit_of_vengeance",
    "https://www.rottentomatoes.com/m/legion_2010",
    "https://www.rottentomatoes.com/m/mortal_engines",
    "https://www.rottentomatoes.com/m/your_name",
    "https://www.rottentomatoes.com/m/gemini_man_2019",
    "https://www.rottentomatoes.com/m/dracula_untold",
    "https://www.rottentomatoes.com/m/maleficent_mistress_of_evil",
    "https://www.rottentomatoes.com/m/bright",
    "https://www.rottentomatoes.com/m/artemis_fowl",
    "https://www.rottentomatoes.com/m/alice_in_wonderland_through_the_looking_glass",
    "https://www.rottentomatoes.com/m/van_helsing",
    "https://www.rottentomatoes.com/m/i_frankenstein",
    "https://www.rottentomatoes.com/m/sucker_punch_2011",
    "https://www.rottentomatoes.com/m/the_twilight_saga_breaking_dawn_part_1",
    "https://www.rottentomatoes.com/m/lara_croft_tomb_raider",
    "https://www.rottentomatoes.com/m/daredevil",
    "https://www.rottentomatoes.com/m/the-adventures-of-sharkboy-and-lavagirl-in-3d",
    "https://www.rottentomatoes.com/m/max_payne",
    "https://www.rottentomatoes.com/m/league_of_extraordinary_gentlemen",
    "https://www.rottentomatoes.com/m/the_last_witch_hunter",
    "https://www.rottentomatoes.com/m/silent_hill_revelation",
    "https://www.rottentomatoes.com/m/lake_house",
    "https://www.rottentomatoes.com/m/1112951-time_machine",
    "https://www.rottentomatoes.com/m/beauty_and_the_beast_1991",
    "https://www.rottentomatoes.com/m/max_steel",
    "https://www.rottentomatoes.com/m/howard_the_duck",
    "https://www.rottentomatoes.com/m/the_smurfs_2",
    "https://www.rottentomatoes.com/m/mummy_tomb_of_the_dragon_emperor",
    "https://www.rottentomatoes.com/m/hocus_pocus",
    "https://www.rottentomatoes.com/m/1040378-cool_world",
    "https://www.rottentomatoes.com/m/gullivers-travels-2010",
    "https://www.rottentomatoes.com/m/spawn",
    "https://www.rottentomatoes.com/m/in-the-name-of-the-king-a-dungeon-siege-tale",
    "https://www.rottentomatoes.com/m/the_cobbler_2015",
    "https://www.rottentomatoes.com/m/the_huntsman_winters_war",
    "https://www.rottentomatoes.com/m/my_little_pony_the_movie_2017",
    "https://www.rottentomatoes.com/m/the_little_mermaid_2_return_to_the_sea",
    "https://www.rottentomatoes.com/m/1013259-mannequin",
    "https://www.rottentomatoes.com/m/brothers_grimm",
    "https://www.rottentomatoes.com/m/spy_kids_3d_game_over",
    "https://www.rottentomatoes.com/m/blade_of_the_47_ronin",
    "https://www.rottentomatoes.com/m/10010694-season_of_the_witch",
    "https://www.rottentomatoes.com/m/strange_magic",
    "https://www.rottentomatoes.com/m/absolution_2018",
    "https://www.rottentomatoes.com/m/goosebumps_2_haunted_halloween",
    "https://www.rottentomatoes.com/m/superman_iv_the_quest_for_peace",
    "https://www.rottentomatoes.com/m/blade_trinity",
    "https://www.rottentomatoes.com/m/the_one",
    "https://www.rottentomatoes.com/m/jiu_jitsu",
    "https://www.rottentomatoes.com/m/pinocchio"
]
