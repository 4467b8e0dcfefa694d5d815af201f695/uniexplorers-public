/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
            // Upon like, increment relevant num_likes
            .raw(`
                CREATE OR REPLACE FUNCTION increment_num_likes()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_comment
                    SET num_likes = num_likes + 1
                    WHERE id = NEW.comment_id;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_like_insert
                AFTER INSERT ON comment_likes
                FOR EACH ROW
                EXECUTE FUNCTION increment_num_likes();
            `)
            // Upon unlike, decrement relevant num_likes
            .raw(`
                CREATE OR REPLACE FUNCTION decrement_num_likes()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_comment
                    SET num_likes = num_likes - 1
                    WHERE id = OLD.comment_id;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_like_delete
                AFTER DELETE ON comment_likes
                FOR EACH ROW
                EXECUTE FUNCTION decrement_num_likes();
            `)
            // Upon dislike, increment relevant num_dislikes
            .raw(`
                CREATE OR REPLACE FUNCTION increment_num_dislikes()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_comment
                    SET num_dislikes = num_dislikes + 1
                    WHERE id = NEW.comment_id;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_dislike_insert
                AFTER INSERT ON comment_dislikes
                FOR EACH ROW
                EXECUTE FUNCTION increment_num_dislikes();
            `)
            // Upon un-dislike, decrement relevant num_dislikes
            .raw(`
                CREATE OR REPLACE FUNCTION decrement_num_dislikes()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_comment
                    SET num_dislikes = num_dislikes - 1
                    WHERE id = OLD.comment_id;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_dislike_delete
                AFTER DELETE ON comment_dislikes
                FOR EACH ROW
                EXECUTE FUNCTION decrement_num_dislikes();
            `)
            // Upon addition of child comment, increment num_children
            .raw(`
                CREATE OR REPLACE FUNCTION increment_num_children()
                RETURNS TRIGGER AS $$
                BEGIN
                UPDATE uni_forum_comment
                SET num_children = num_children + 1
                WHERE id = NEW.parent_id;
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_insert
                AFTER INSERT ON uni_forum_comment
                FOR EACH ROW
                WHEN (NEW.parent_id IS NOT NULL)
                EXECUTE FUNCTION increment_num_children();
            `)
            // Upon deletion of child comment, decrement num_children
            .raw(`
                CREATE OR REPLACE FUNCTION decrement_num_children()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_comment AS parent_comment
                    SET num_children = num_children - 1
                    WHERE id = OLD.parent_id;
                
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_comment_delete
                AFTER DELETE ON uni_forum_comment
                FOR EACH ROW
                WHEN (OLD.parent_id IS NOT NULL) -- Only trigger when deleting child comments
                EXECUTE FUNCTION decrement_num_children();
            `)
            // Upon addition of comment in relevant thread, increment num_comments
            .raw(`
                CREATE OR REPLACE FUNCTION increment_thread_num_comments()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_thread
                    SET num_comments = num_comments + 1
                    WHERE id = NEW.thread_id;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_new_comment_insert
                AFTER INSERT ON uni_forum_comment
                FOR EACH ROW
                EXECUTE FUNCTION increment_thread_num_comments();
            `)
            // Upon deletion of comment in relevant thread, decrement num_comments
            .raw(`
                CREATE OR REPLACE FUNCTION decrement_thread_num_comments()
                RETURNS TRIGGER AS $$
                BEGIN
                    UPDATE uni_forum_thread
                    SET num_comments = num_comments - 1
                    WHERE id = OLD.thread_id;
                    RETURN OLD;
                END;
                $$ LANGUAGE plpgsql;
            `)
            .raw(`
                CREATE TRIGGER after_new_comment_delete
                AFTER DELETE ON uni_forum_comment
                FOR EACH ROW
                EXECUTE FUNCTION decrement_thread_num_comments();
            `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .raw(`DROP TRIGGER IF EXISTS after_comment_like_insert ON comment_likes;`)
        .raw(`DROP FUNCTION IF EXISTS increment_num_likes();`)
        .raw(`DROP TRIGGER IF EXISTS after_comment_like_delete ON comment_likes;`)
        .raw(`DROP FUNCTION IF EXISTS decrement_num_likes();`)
        .raw(`DROP TRIGGER IF EXISTS after_comment_dislike_insert ON comment_dislikes;`)
        .raw(`DROP FUNCTION IF EXISTS increment_num_dislikes();`)
        .raw(`DROP TRIGGER IF EXISTS after_comment_dislike_delete ON comment_likes;`)
        .raw(`DROP FUNCTION IF EXISTS decrement_num_dislikes();`)
        .raw(`DROP TRIGGER IF EXISTS after_comment_insert ON uni_forum_comment;`)
        .raw(`DROP FUNCTION IF EXISTS increment_num_children();`)
        .raw(`DROP TRIGGER IF EXISTS after_comment_delete ON uni_forum_comment;`)
        .raw(`DROP FUNCTION IF EXISTS decrement_num_children();`)
        .raw(`DROP TRIGGER IF EXISTS after_new_comment_insert ON uni_forum_comment;`)
        .raw(`DROP FUNCTION IF EXISTS increment_thread_num_comments();`)
        .raw(`DROP TRIGGER IF EXISTS after_new_comment_delete ON uni_forum_comment;`)
        .raw(`DROP FUNCTION IF EXISTS decrement_thread_num_comments();`)
}
