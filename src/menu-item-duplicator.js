(function($) {

    var duplicatorClass = 'js-menu-item-duplicator-duplicate',
        api;

    function init() {
        api = wpNavMenu;

        populateActions($('.menu-item'));

        $(document).on('menu-item-added', onMenuItemAdded);
        $('#post-body-content').on('click', '.' + duplicatorClass, onDuplicate);
    }

    function onMenuItemAdded(event, $markup) {
        populateActions($markup);
    }

    function onDuplicate() {
        var $element = $(this).closest('li'),
            menuItem = $element.getItemData(),
            menuItemID = menuItem['menu-item-db-id'],
            items = { '-1': menuItem },
            itemIndex = 1,
            list = [];

        list.push({
            relativeDepth: 0
        });

        menuItem['menu-item-db-id'] = 0;
        menuItem['menu-item-parent-id'] = 0;

        var $next = $element,
            parentIds = [ menuItemID ],
            relativeDepth = 1,
            itemData,
            itemID;

        while ( true ) {
            $next = $next.next();

            // No more menu items to check (end of navigation)
            if (!$next.length) {
                break;
            }

            itemData = $next.getItemData();

            // Loop through our parents, start with the last one
            for (var i = parentIds.length - 1; i >= 0; i--) {

                // If the current id doesn't match it means we're going up a level
                if ( itemData['menu-item-parent-id'] !== parentIds[ i ] ) {
                    parentIds.pop();
                    relativeDepth--;
                    continue;
                }

                itemIndex++;
                itemID = itemData['menu-item-db-id'];
                itemData['menu-item-db-id'] = 0;
                itemData['menu-item-parent-id'] = 0;

                list.push({
                    relativeDepth: relativeDepth
                });

                items[ (itemIndex*-1).toString() ] = itemData;

                relativeDepth++;
                parentIds.push(itemID);
                break;
            }

            // if there no parentIds left it means we went out of the scope of our sub-level
            if ( ! parentIds.length ) {
                break;
            }
        }

        api.addItemToMenu(items, function(markup) {
            var $markup = $(markup),
                index = 0;

            $markup.hideAdvancedMenuItemFields().appendTo( api.targetList );
            api.refreshKeyboardAccessibility();
            api.refreshAdvancedAccessibility();

            $markup.each(function(i) {
                var listItem,
                    $li = $(this),
                    propName = $li.prop('tagName');

                if ( ! propName || propName.toUpperCase() !== 'LI' ) {
                    return true;
                }

                listItem = list[index];
                index++;

                if ( listItem.relativeDepth < 1 ) {
                    return true;
                }

                $li.shiftHorizontally(listItem.relativeDepth);
            });

            $( document ).trigger( 'menu-item-added', [ $markup ] );
        });
    }

    /**
     * Populate duplicate button on passed elements.
     *
     * @param {array} $items
     */
    function populateActions($items) {
        $items.each(function() {
            var $element = $(this),
                $duplicate = $('<a href="#"></a>'),
                $separator = $element.find('.meta-sep').clone(),
                $actions = $element.find('.menu-item-actions');

            // Skip items that already has the link
            if ($element.find('.' + duplicatorClass).length) {
                return true;
            }

            $duplicate.addClass(duplicatorClass);
            $duplicate.text(menuItemDuplicator.labels.duplicate);

            $actions.append($separator);
            $actions.append($duplicate);
        });
    }

    $(document).ready(init);

})(jQuery);