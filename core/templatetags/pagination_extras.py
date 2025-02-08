from django import template

register = template.Library()

PAGES_TO_DISPLAY = 2


@register.filter
def is_near_edge(page_number, last_page_number):
    """ Checks if page is near start or end of pagination """
    return (page_number <= PAGES_TO_DISPLAY) or (page_number > last_page_number - PAGES_TO_DISPLAY)


@register.filter
def is_near_current(page_number, current_page_number):
    """ Checks if page is near the current page """
    return current_page_number - PAGES_TO_DISPLAY <= page_number <= current_page_number + PAGES_TO_DISPLAY


@register.filter
def is_to_be_replaced_by_spacer(page_number, last_page_number):
    """ Checks if page number is to be replaced by spacer """
    return page_number == PAGES_TO_DISPLAY + 1 or page_number == last_page_number - PAGES_TO_DISPLAY
