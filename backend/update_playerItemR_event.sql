CREATE EVENT updateStockEvent
    ON SCHEDULE EVERY 1 DAY STARTS '2020-01-01 00:00:00'  ON COMPLETION PRESERVE ENABLE 
    DO
		UPDATE playerItemR
		SET usedToday = false;