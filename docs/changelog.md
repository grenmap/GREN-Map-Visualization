# Updating the changelog

The changelog should be updated on the completion of every task as a whole. Individual
commits should not be added as a change, but rather the changes applied should be added with
sufficient explanation of what was changed with regards to the change category.

# Unreleased
There should be a "unreleased" section in the file for changes that are upcoming or not implemented in the current release.

# Date Format
Dates in the changelog should take the format of yyyy-mm-dd,
as it follows the general convention for changelog files. This format also doesn't overlap in 
ambiguous ways with other date formats, unlike some regional formats that switch the position of
month and day numbers. These reasons, and the fact this date format is an ISO standard, are why
it is the recommended date format for changelog entries.

# Change categories

## Added
Any features that have been added that did not exist in the previous version should be under
the 'Added' category.

## Changed
Changes to existing functionality should go under the 'Changed' category.

## Deprecated
Any features that are intended to be removed should go under this category, with a suggestion
of a replacement for the functionality or a reason for its removal.

## Removed
Any features that are removed from the software completely should go under this category.

## Fixed
Whenever a bug or issue is identified and resolved it should go under this category.

## Security
Any changes regarding security fixes should go under this category.

